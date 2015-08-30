<?php

class User extends AbstractUser{

	protected $id;
	protected $first_name;
	protected $last_name;
	protected $middle_name;
	protected $email;
	protected $token;
	protected $avatar_url;
	protected $organization_id;

	private $editor_instance;



	public function __construct(PDO $db, $token = null){
		if ((!isset($_SESSION['id']) || trim($_SESSION['id']) == ''
			|| !isset($_SESSION['token']) || trim($_SESSION['token']) == '')
			&& $token == null){
			throw new LogicException('Пользователь с такими данными не найден');
		}
		if (isset($_SESSION['id'])){
			$p_get_user = $db->prepare('SELECT users.*
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
			$p_get_user = $db->prepare('SELECT users.*
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
		$this->token = $row['token'];
		$this->avatar_url = $row['avatar_url'];
		$this->organization_id = $row['organization_id'];
	}

	public function getId() {
		return $this->id;
	}

	public function isEditor(){
		return is_numeric($this->organization_id);
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

	public function addFavoriteEvent(Event $event, $event_date){
		$q_ins_favorite = 'INSERT INTO favorite_events(user_id, event_id, status, event_date, created_at)
			VALUES (:user_id, :event_id, 1, :event_date, NOW())
			ON DUPLICATE KEY UPDATE status = 1';
		$p_ins_favorite = $this->db->prepare($q_ins_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_date' => $event_date,
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_MAKE_FAVORITE', $this->db);
		return new Result(true, 'Событие успешно добавлено в избранное', array('favorite_id' => $this->db->lastInsertId()));
	}

	public function deleteFavoriteEvent(Event $event, $event_date){
		$q_upd_favorite = 'UPDATE favorite_events SET status = 0
			WHERE  user_id = :user_id
			 AND event_id = :event_id
			 AND event_date = :event_date';
		$p_ins_favorite = $this->db->prepare($q_upd_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_date' => $event_date,
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_DELETE_FAVORITE', $this->db);
		return new Result(true, 'Событие успешно удалено из избранных');
	}

	public function updateSettings($__request) {

	}

	public function getMainInfo(){
		return new Result(true, '', array(
			'first_name' => $this->getFirstName(),
			'last_name' => $this->getLastName(),
			'id' => $this->getId(),
			'avatar_url' => $this->getAvatarUrl(),
			'middle_name' => $this->getMiddleName(),
			'is_editor' => $this->isEditor()
		));
	}
}