<?php

class User extends AbstractUser{

	protected $id;
	protected $first_name;
	protected $last_name;
	protected $middle_name;
	protected $email;
	protected $token;
	protected $avatar_url;
	protected $is_editor;
	protected $token_id;
	protected $blurred_image_url;

	protected $google_uid;
	protected $facebook_uid;
	protected $vk_uid;


	protected $show_to_friends;
	protected $notify_in_browser;

	private $editor_instance;
	protected $db;



	public function __construct(PDO $db, $token = null){
		if ((!isset($_SESSION['id']) || trim($_SESSION['id']) == ''
			|| !isset($_SESSION['token']) || trim($_SESSION['token']) == '')
			&& $token == null){
			throw new AuthorizationException('Пользователь с такими данными не найден', $db);
		}
		if (isset($_SESSION['id'])){
			$p_get_user = $db->prepare("SELECT users.*, tokens.id AS token_id,
				(SELECT COUNT(user_id)::int FROM users_organizations WHERE user_id = users.id AND status = TRUE) > 0 AS is_editor
				FROM users
				INNER JOIN tokens ON tokens.user_id = users.id
				WHERE users.id = :id
				AND tokens.token = :token
				AND tokens.expires_on > DATE_PART('epoch', CURRENT_TIMESTAMP)::int");
			$stm = array(
				':id' => $_SESSION['id'],
				':token' => $_SESSION['token']
			);
		}else{
			$p_get_user = $db->prepare("SELECT users.*,tokens.id AS token_id,
				(SELECT COUNT(user_id) FROM users_organizations WHERE user_id = users.id AND status = TRUE) > 0 AS is_editor
				FROM users
				INNER JOIN tokens ON tokens.user_id = users.id
				WHERE
					tokens.token = :token
				AND tokens.expires_on > DATE_PART('epoch', CURRENT_TIMESTAMP)::int");
			$stm = array(':token' => $token);
		}

		$p_get_user->execute($stm);

		if ($p_get_user === FALSE) throw new DBQueryException('USER_NOT_EXIST', $db);
		if ($p_get_user->rowCount() !== 1) throw new AuthorizationException('Пользователь с такими данными не найден', $db);
		$row = $p_get_user->fetch();

		$this->db = $db;
		$this->id = $row['id'];
		$this->first_name = $row['first_name'];
		$this->last_name = $row['last_name'];
		$this->middle_name = $row['middle_name'];
		$this->email = $row['email'];
		$this->token = $token ? $token : $_SESSION['token'];
		$this->avatar_url = $row['avatar_url'];
		$this->is_editor = $row['is_editor'];
		$this->token_id = $row['token_id'];
		$this->blurred_image_url = $row['blurred_image_url'];

		$this->vk_uid = $row['vk_uid'];
		$this->facebook_uid = $row['facebook_uid'];
		$this->google_uid = $row['google_uid'];

		$this->show_to_friends = $row['show_to_friends'];
		$this->notify_in_browser = $row['notify_in_browser'];
	}

	public function getId() {
		return $this->id;
	}

	protected function getDB() : PDO {
		return $this->db;
	}

	public function isEditor(){
		return $this->is_editor;
	}

	public function getEditorInstance(){
		if (!$this->isEditor()) throw new PrivilegesException('Недостаточно прав для совершения действия', $this->db);
		if ($this->editor_instance instanceof Editor == false) {
			$this->editor_instance = new Editor($this->db);
		}
		return $this->editor_instance;
	}

	public function createEvent($data){
		return $this->getEditorInstance()->addNewEvent($data);
	}

	public function getAvatarUrl() {
		return $this->avatar_url;
	}

	public function getFirstName() {
		return $this->first_name;
	}

	public function getLastName() {
		return $this->last_name;
	}

	public function getMiddleName() {
		return $this->middle_name;
	}

	public function addFavoriteEvent(Event $event){
		$q_ins_favorite = 'INSERT INTO favorite_events(user_id, event_id, status, created_at)
			VALUES (:user_id, :event_id, TRUE, NOW())
			ON CONFLICT (user_id, event_id) DO UPDATE SET status = TRUE RETURNING id::int';
		$p_ins_favorite = $this->db->prepare($q_ins_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_MAKE_FAVORITE', $this->db);
		Statistics::Event($event, $this, $this->db, Statistics::EVENT_FAVE);
		return new Result(true, 'Событие успешно добавлено в избранное');
	}

	public function deleteFavoriteEvent(Event $event){
		$q_upd_favorite = 'UPDATE favorite_events SET status = FALSE
			WHERE  user_id = :user_id
			 AND event_id = :event_id';
		$p_ins_favorite = $this->db->prepare($q_upd_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_DELETE_FAVORITE', $this->db);
		Statistics::Event($event, $this, $this->db, Statistics::EVENT_UNFAVE);
		return new Result(true, 'Событие успешно удалено из избранных');
	}

	public function hasFavoriteEvent(Event $event){
		$q_get_is_fav = 'SELECT id::int FROM favorite_events
			WHERE
			user_id = :user_id
			AND event_id = :event_id
			AND status = TRUE';
		$p_get_is_fav = $this->db->prepare($q_get_is_fav);
		$p_get_is_fav->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($p_get_is_fav === FALSE) return new Result(false, '', false);
		return new Result(true, '', $p_get_is_fav->rowCount() == 1);
	}

	public function updateSettings($__request) {
		if (isset($__request['notify-in-browser'])){
			$this->notify_in_browser = $__request['notify-in-browser'] == 'true' ? 1 : 0;
		}
		if (isset($__request['show-to-friends'])){
			$this->show_to_friends = $__request['show-to-friends'] == 'true' ? 1 : 0;
		}
		$q_upd = 'UPDATE users SET
			show_to_friends = :show_to_friends,
			notify_in_browser = :notify_in_browser
			WHERE users.id = :user_id';
		$p_upd = $this->db->prepare($q_upd);

		$result = $p_upd->execute(array(
			':show_to_friends' => $this->show_to_friends,
			':notify_in_browser' => $this->notify_in_browser,
			':user_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('', $this->db);

		return new Result(true, '');
	}

	public function getMainInfo(){

		$account_types = array();

		if ($this->vk_uid != null){
			$account_types[] = 'vk';
		}
		if ($this->google_uid != null){
			$account_types[] = 'google';
		}
		if ($this->facebook_uid != null){
			$account_types[] = 'facebook';
		}

		return new Result(true, '', array(
			'first_name' => $this->getFirstName(),
			'last_name' => $this->getLastName(),
			'id' => $this->getId(),
			'avatar_url' => $this->getAvatarUrl(),
			'blurred_image_url' => $this->blurred_image_url,
			'middle_name' => $this->getMiddleName(),
			'is_editor' => $this->isEditor(),
			'accounts' => $account_types
		));
	}

	public function logout() {
		session_unset();
		session_destroy();
		session_write_close();
	}

	public function getSettings() {
		return new Result(true, '', array(
			'show_to_friends' => $this->show_to_friends,
			'notify_in_browser' => $this->notify_in_browser,
		));
	}

	public function updateDeviceToken($device_token, $client_type){
		$q_upd_device_token = 'UPDATE tokens SET
			device_token = :device_token,
			client_type = :client_type
			WHERE user_id = :user_id
			AND tokens.token = :token';
		$p_upd = $this->db->prepare($q_upd_device_token);
		$res = $p_upd->execute(array(
			':device_token' => $device_token,
			':user_id' => $this->getId(),
			':token' => $this->token,
			':client_type' => $client_type
		));


		//disable same tokens for this user (device tokens can duplicate)
		$q_upd_token = "UPDATE tokens SET expires_on = DATE_PART('epoch', CURRENT_TIMESTAMP)::int
			WHERE user_id = :user_id
			AND client_type = :client_type
			AND device_token = :device_token
			AND tokens.token != :token";
		$p_upd_token = $this->db->prepare($q_upd_token);
		$res2 = $p_upd_token->execute(array(
			':device_token' => $device_token,
			':user_id' => $this->getId(),
			':token' => $this->token,
			':client_type' => $client_type
		));
		if ($res === FALSE || $res2 === FALSE) throw new DBQueryException('CANT UPDATE TOKEN', $this->db);
		return new Result(true, '', array('token' => $this->token));
	}

	public function getTokenId() {
		return $this->token_id;
	}

}