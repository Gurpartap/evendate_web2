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



	public function __construct(PDO $db){
		if (!isset($_SESSION['id']) || trim($_SESSION['id']) == ''
			|| !isset($_SESSION['token']) || trim($_SESSION['token']) == ''){
			throw new LogicException('Пользователь с такими данными не найден');
		}
		$p_get_user = $db->prepare('SELECT users.*
			FROM users
			WHERE id = :id
			AND token = :token');

		$p_get_user->execute(array(
			':id' => $_SESSION['id'],
			':token' => $_SESSION['token']
		));

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
		$this->organization_id = intval($row['organization_id']);
	}

	public function getId() {
		return $this->id;
	}

	public function isEditor(){
		return is_int($this->organization_id);
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

	/**
	 * @return mixed
	 */
	public function getAvatarUrl() {
		return $this->avatar_url;
	}

	/**
	 * @return mixed
	 */
	public function getFirstName() {
		return $this->first_name;
	}

	/**
	 * @return mixed
	 */
	public function getLastName() {
		return $this->last_name;
	}

	/**
	 * @return mixed
	 */
	public function getMiddleName() {
		return $this->middle_name;
	}

	public function subscribe(Organization $organization){

	}


	public function getOAuthUserInstances(){
		$q_get_ = '';
	}
}