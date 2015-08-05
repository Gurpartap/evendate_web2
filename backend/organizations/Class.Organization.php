<?php



class Organization {

	private $id;
	private $name;
	private $short_name;
	private $status;
	private $type_id;
	private $img_url;
	private $description;
	private $background_img_url;


	public function __construct($id, PDO $db) {
		$p_get_organization = $db->prepare('SELECT id,
			description, img_url, type_id, status, short_name, name,
			background_img_url
			FROM organizations
			WHERE organizations.id = :id');

		$result = $p_get_organization->execute(array(
			':id' => $id
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_ORGANIZATION_QUERY_ERROR', $db);
		if ($p_get_organization->rowCount() == 0) throw new InvalidArgumentException('CANT_GET_ORGANIZATION');

		$row = $p_get_organization->fetch();
		$this->db = $db;
		$this->id = $row['id'];
		$this->status = $row['status'];
		$this->name = $row['name'];
		$this->type_id = $row['type_id'];
		$this->img_url = $row['img_url'];
		$this->description = $row['description'];
		$this->short_name = $row['short_name'];
		$this->background_img_url = $row['background_img_url'];
	}

	/**
	 * @return mixed
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return mixed
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * @return mixed
	 */
	public function getStatus() {
		return $this->status;
	}

	/**
	 * @return mixed
	 */
	public function getTypeId() {
		return $this->type_id;
	}

	/**
	 * @return mixed
	 */
	public function getImgUrl() {
		return $this->img_url;
	}

	/**
	 * @return mixed
	 */
	public function getDescription() {
		return $this->description;
	}

	/**
	 * @return mixed
	 */
	public function getShortName() {
		return $this->short_name;
	}

	/**
	 * @return mixed
	 */
	public function getBackgroundImgUrl() {
		return $this->background_img_url;
	}



	public function getFullParams(){
		return new Result(true, '', array(
			'id' => $this->getId(),
			'name' => $this->getName(),
			'short_name' => $this->getShortName(),
			'type_id' => $this->getTypeId(),
			'img_url' => $this->getImgUrl(),
			'background_img_url' => $this->getBackgroundImgUrl(),
			'description' => $this->getDescription()
		));
	}

}