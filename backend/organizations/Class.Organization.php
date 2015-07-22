<?php



class Organization {

	private $id;
	private $name;
	private $status;
	private $type_id;
	private $img_url;
	private $description;


	public function __construct($id, PDO $db) {
		$p_get_organization = $db->prepare('SELECT id, organization_id,
			description, img_url, type_id, status
			FROM organizations
			WHERE organizations.id = :id');

		$result = $p_get_organization->execute(array(
			':id' => $id
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_ORGANIZATION_QUERY_ERROR', $db);
		if ($p_get_organization->rowCount() != 0) throw new InvalidArgumentException('CANT_GET_ORGANIZATION', $db);

		$row = $p_get_organization->fetch();
		$this->db = $db;
		$this->id = $row['id'];
		$this->status = $row['status'];
		$this->name = $row['organization_id'];
		$this->type_id = $row['type_id'];
		$this->img_url = $row['img_url'];
		$this->description = $row['description'];
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}





}