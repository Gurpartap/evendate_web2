<?php

require_once $ROOT_PATH.'backend/organizations/Class.OrganizationsCollection.php';
require_once $ROOT_PATH.'backend/organizations/Class.Organization.php';

class Friend extends AbstractUser{

	private $id;
	private $db;

	private $user;


	public function __construct($id, User $user, PDO $db) {
		$q_get_friend = 'SELECT users.id, users.first_name, users.last_name,
			users.avatar_url
			FROM users
			WHERE users.id = :id';
		$p_get = $db->prepare($q_get_friend);

		$result = $p_get->execute(array(
			':id' => $id
		));


		if ($result === FALSE) throw new DBQueryException('', $db);
		if ($p_get->rowCount() == 0) throw new LogicException('User is not your friend');
		$this->id = $id;
		$this->db = $db;
		$this->user = $user;
	}


	public function getId(){
		return $this->id;
	}

	public function getSubscriptions(){
		return OrganizationsCollection::filter($this->db, $this->user, array(
			'friend' => $this
		));
	}

}