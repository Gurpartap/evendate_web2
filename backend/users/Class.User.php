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


	protected $show_to_friends;
	protected $notify_in_browser;

	private $editor_instance;



	public function __construct(PDO $db, $token = null){
		if ((!isset($_SESSION['id']) || trim($_SESSION['id']) == ''
			|| !isset($_SESSION['token']) || trim($_SESSION['token']) == '')
			&& $token == null){
			throw new LogicException('Пользователь с такими данными не найден');
		}
		if (isset($_SESSION['id'])){
			$p_get_user = $db->prepare('SELECT users.*, tokens.id AS token_id,
				(SELECT COUNT(user_id) FROM users_organizations WHERE user_id = users.id AND status = 1) > 0 AS is_editor
				FROM users
				INNER JOIN tokens ON tokens.user_id = users.id
				WHERE users.id = :id
				AND tokens.token = :token
				AND tokens.expires_on > UNIX_TIMESTAMP(NOW())');
			$stm = array(
				':id' => $_SESSION['id'],
				':token' => $_SESSION['token']
			);
		}else{
			$p_get_user = $db->prepare('SELECT users.*,tokens.id AS token_id,
				(SELECT COUNT(user_id) FROM users_organizations WHERE user_id = users.id AND status = 1) > 0 AS is_editor
				FROM users
				INNER JOIN tokens ON tokens.user_id = users.id
				WHERE
					tokens.token = :token
				AND tokens.expires_on > UNIX_TIMESTAMP(NOW())');
			$stm = array(
				':token' => $token
			);
		}

		$p_get_user->execute($stm);

		if ($p_get_user === FALSE) throw new DBQueryException('USER_NOT_EXIST', $db);
		if ($p_get_user->rowCount() !== 1) throw new LogicException('Пользователь с такими данными не найден');
		$row = $p_get_user->fetch();

		$this->db = $db;
		$this->id = $row['id'];
		$this->first_name = $row['first_name'];
		$this->last_name = $row['last_name'];
		$this->middle_name = $row['middle_name'];
		$this->email = $row['email'];
		$this->token = $token ? $token : $row['token'];
		$this->avatar_url = $row['avatar_url'];
		$this->is_editor = $row['is_editor'];
		$this->token_id = $row['token_id'];

		$this->show_to_friends = $row['show_to_friends'];
		$this->notify_in_browser = $row['notify_in_browser'];
	}

	public static function getLinkToSocialNetwork($type, $uid) {
		return EventsCollection::$URLs[$type] . $uid;
	}

	public function getId() {
		return $this->id;
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

	public function subscribe(Organization $organization){

	}

	public function addFavoriteEvent(Event $event){
		$q_ins_favorite = 'INSERT INTO favorite_events(user_id, event_id, status, created_at)
			VALUES (:user_id, :event_id, 1, NOW())
			ON DUPLICATE KEY UPDATE status = 1';
		$p_ins_favorite = $this->db->prepare($q_ins_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_MAKE_FAVORITE', $this->db);
		Statistics::Event($event, $this, $this->db, Statistics::EVENT_FAVE);
		return new Result(true, 'Событие успешно добавлено в избранное', array('favorite_id' => $this->db->lastInsertId()));
	}

	public function deleteFavoriteEvent(Event $event){
		$q_upd_favorite = 'UPDATE favorite_events SET status = 0
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
		$q_get_is_fav = 'SELECT * FROM favorite_events
			WHERE
			user_id = :user_id
			AND event_id = :event_id
			AND status = 1';
		$p_get_is_fav = $this->db->prepare($q_get_is_fav);
		$p_get_is_fav->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($p_get_is_fav === FALSE) return new Result(false, '', false);
		return new Result(true, '', $p_get_is_fav->rowCount() == 1);
	}

	public function updateSettings($__request) {
		print_r($__request);
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

		print_r(array(
			':show_to_friends' => $this->show_to_friends,
			':notify_in_browser' => $this->notify_in_browser,
			':user_id' => $this->getId()
		));

		$result = $p_upd->execute(array(
			':show_to_friends' => $this->show_to_friends,
			':notify_in_browser' => $this->notify_in_browser,
			':user_id' => $this->getId()
		));

		if ($result === FALSE) throw new DBQueryException('', $this->db);

		return new Result(true, '');
	}

	public function getMainInfo(){
		return new Result(true, '', array(
			'first_name' => $this->getFirstName(),
			'last_name' => $this->getLastName(),
			'id' => $this->getId(),
			'avatar_url' => $this->getAvatarUrl(),
			'middle_name' => $this->getMiddleName(),
			'is_editor' => (boolean) $this->isEditor()
		));
	}

	public function logout() {
		session_unset();
		session_destroy();
		session_write_close();
	}

	public function getSettings() {
		return new Result(true, '', array(
			'show_to_friends' => (boolean) $this->show_to_friends,
			'notify_in_browser' => (boolean) $this->notify_in_browser,
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
			'client_type' => $client_type
		));

		if ($res === FALSE) throw new DBQueryException('', $this->db);
		return new Result(true, '');
	}

	public function getTokenId() {
		return $this->token_id;
	}

	public function getFriends() {
		$q_get_friends = 'SELECT users.first_name, users.last_name, users.avatar_url,
 			view_friends.friend_uid, view_friends.type
 			FROM view_friends
			 INNER JOIN users ON users.id = view_friends.friend_id
			WHERE user_id = :user_id
			GROUP BY friend_id';

		$p_get_friends = $this->db->prepare($q_get_friends);
		$result = $p_get_friends->execute(array(
			':user_id' => $this->getId()
		));
		if ($result === FALSE) throw new DBQueryException('', $this->db);

		$friends = $p_get_friends->fetchAll();

		foreach($friends as &$friend){
			$friend['link'] = User::getLinkToSocialNetwork($friend['type'], $friend['friend_uid']);
		}

		return new Result(true, '', $friends);
	}

	public function getFriendsFeed($page, $length) {

		/*EVENTS*/

		$q_get_stat_events = "
			(SELECT
			   event_id,
			   null as organization_id,
			   stat_events.stat_type_id,
			   stat_event_types.type_code,
			   MAX(stat_events.created_at) as created_at,
			   tokens.user_id,
			   users.avatar_url,
			   users.id,
			   users.last_name,
			   users.first_name,
			   view_friends.friend_uid,
			   view_friends.type,
			   tokens.user_id,
			   stat_event_types.entity,
			   events.title,
			   events.image_horizontal,
			   events.image_vertical,
			   events.event_end_date,
			   events.event_start_date,
			   null as name,
			   null as short_name,
			   null as background_img_url,
			   null as background_medium_img_url,
			   null as background_small_img_url,
			   null as img_url,
			   null as img_small_url,
			   null as img_medium_url
			  FROM stat_events
			    INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
			    INNER JOIN tokens ON tokens.id = stat_events.token_id
			    INNER JOIN view_friends ON view_friends.friend_id = tokens.user_id
			    INNER JOIN events ON stat_events.event_id = events.id
			    INNER JOIN users ON tokens.user_id = users.id
			  WHERE
			    (stat_event_types.type_code = :fave
			    OR stat_event_types.type_code = :unfave)
			    AND events.status = 1
			    AND view_friends.user_id = :user_id
			  GROUP BY stat_events.event_id, users.id)

			UNION
			(SELECT
			   null as event_id,
			   organization_id,
			   stat_organizations.stat_type_id,
			   stat_event_types.type_code,
			   MAX(stat_organizations.created_at) as created_at,
			   tokens.user_id,
			   users.avatar_url,
			   users.id,
			   users.last_name,
			   users.first_name,
			   view_friends.friend_uid,
			   view_friends.type,
			   tokens.user_id,
			   stat_event_types.entity,
			   null as title,
			   null as image_horizontal,
			   null as image_vertical,
			   null as event_end_date,
			   null as event_start_date,
			  organizations.name,
			  organizations.short_name,
			  organizations.background_img_url,
			  organizations.background_medium_img_url,
			  organizations.background_small_img_url,
			  organizations.img_url,
			  organizations.img_small_url,
			  organizations.img_medium_url
			  FROM stat_organizations
			    INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
			    INNER JOIN tokens ON tokens.id = stat_organizations.token_id
			    INNER JOIN view_friends ON view_friends.friend_id = tokens.user_id
			    INNER JOIN organizations ON stat_organizations.organization_id = organizations.id
			    INNER JOIN users ON tokens.user_id = users.id
			WHERE
			  (stat_event_types.type_code = :subscribe
			    OR stat_event_types.type_code = :unsubscribe)
			    AND organizations.status = 1
			    AND view_friends.user_id = :user_id
			GROUP BY stat_organizations.organization_id, users.id)
			ORDER BY created_at DESC
			LIMIT " . ($page * $length) ." , {$length}";

		$prep_arr = array(
			':fave' => Statistics::EVENT_FAVE,
			':unfave' => Statistics::EVENT_UNFAVE,
			':subscribe' => Statistics::ORGANIZATION_SUBSCRIBE,
			':unsubscribe' => Statistics::ORGANIZATION_UNSUBSCRIBE,
			':user_id' => $this->getId()
		);

		$p_get_stat = $this->db->prepare($q_get_stat_events);
		$result = $p_get_stat->execute($prep_arr);

		if ($result === FALSE) throw new DBQueryException('CANT_GET_FEED', $this->db);

		$stat_events = $p_get_stat->fetchAll();

		$result_array = array();

		foreach($stat_events as $event){
			$to_push = array(
				'stat_type_id' => $event['stat_type_id'],
				'type_code' => $event['type_code'],
				'entity' => $event['entity'],
				'created_at' => $event['created_at'],
				'user' => array(
					'id' => $event['user_id'],
					'type' => $event['type'],
					'friend_uid' => $event['friend_uid'],
					'avatar_url' => $event['avatar_url'],
					'first_name' => $event['first_name'],
					'last_name' => $event['last_name'],
					'link' => self::getLinkToSocialNetwork($event['type'], $event['friend_uid'])
				)
			);
			if ($event['entity'] == Statistics::ENTITY_EVENT){
				$_event = EventsCollection::makeImgUrls($event);
				$_event = array_merge($_event, array(
					'id' => $event['event_id'],
					'title' => $event['title'],
					'image_horizontal' => $event['image_horizontal'],
					'image_vertical' => $event['image_vertical'],
					'event_end_date' => $event['event_end_date'],
					'event_start_date' => $event['event_start_date'],
				));
				$to_push['event'] = $_event;
			}elseif ($event['entity'] == Statistics::ENTITY_ORGANIZATION){
				$_organization = Organization::normalizeOrganization(array(
					'id' => $event['organization_id'],
					'name' => $event['name'],
					'short_name' => $event['short_name'],
					'background_img_url' => $event['background_img_url'],
					'background_medium_img_url' => $event['background_medium_img_url'],
					'background_small_img_url' => $event['background_small_img_url'],
					'img_url' => $event['img_url'],
					'img_small_url' => $event['img_small_url'],
					'img_medium_url' => $event['img_medium_url']
				));
				$to_push['organization'] = $_organization;
			}
			$result_array[] = $to_push;
		}

		return new Result(true, '', $result_array);
	}
}