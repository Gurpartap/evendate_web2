<?php

require_once $BACKEND_FULL_PATH . '/events/Class.Event.php';

class Editor extends User
{


	/**
	 * Editor constructor.
	 * @param PDO $db
	 * @param null $token
	 */
	public function __construct(ExtendedPDO $db, $token = null)
	{
		parent::__construct($db, App::getCurrentUser()->getToken());
	}

	public function addNewEvent(array $data)
	{
		$data['filenames'] = $data['filenames'] ?? $data['file_names'];
		if (isset($data['organization_id'])) {
			$organization = OrganizationsCollection::one(
				$this->getDB(),
				$this,
				intval($data['organization_id']), array());
			if (!$this->isEditor($organization))
				throw new PrivilegesException('Вы не являетесь редактором данной организации', $this->getDB());
		} else {
			$organization = $this->getDefaultOrganization();
		}

		return Event::create($this->getDB(), $organization, array_merge($data, array(
			'image_extensions' => array(
				'vertical' => 'jpg',
				'horizontal' => App::getImageExtension($data['filenames']['horizontal'])
			),
			'creator_id' => $this->getId()
		)));
	}

	public function isEditor(Organization $organization = null): bool
	{
		if ($organization instanceof Organization) {
			$q_get_org = 'SELECT users_organizations.organization_id
					FROM users_organizations
					WHERE users_organizations.status = TRUE
					AND users_organizations.user_id = :user_id
					AND users_organizations.organization_id = :organization_id;';
			$p_get_default = $this->getDB()->prepareExecuteRaw($q_get_org, array(
				':user_id' => $this->getId(),
				':organization_id' => $organization->getId()
			), 'CANT_GET_IS_EDITOR');
			return $p_get_default->rowCount() != 0;
		} else {
			return $this->is_editor;
		}
	}

	public function isAdmin(Organization $organization): bool
	{
		$q_get = App::queryFactory()->newSelect();
		$q_get
			->cols(array('id'))
			->from('users_organizations')
			->join('INNER', 'users_roles', 'users_roles.id = users_organizations.role_id')
			->where('user_id = :user_id')
			->where('users_organizations.organization_id = :organization_id')
			->where('users_roles.name = \'admin\'');

		$p_get_data = $this->db->prepareExecute($q_get, 'CANT_GET_USERS_ORGANIZATIONS', array(
			':user_id' => $this->getId(),
			':organization_id' => $organization->getId()
		));

		return $p_get_data->rowCount() > 0;
	}

	public function getDefaultOrganization(): Organization
	{
		$q_get_default = 'SELECT users_organizations.organization_id
				FROM users_organizations
				WHERE users_organizations.status = 1
				AND users_organizations.user_id = :user_id
				ORDER BY by_default DESC
				LIMIT 1';
		$p_get_default = $this->getDB()->prepareExecuteRaw($q_get_default, array(
			':user_id' => $this->getId()
		), 'CANT_GET_DEFAULT_ORGANIZATION');
		$row = $p_get_default->fetch();
		return OrganizationsCollection::one(
			$this->getDB(),
			$this,
			intval($row['organization_id'])
		);
	}

	private function inviteUser(Friend $friend = null, string $email, Organization $organization){

	}

	public function inviteUserById(int $id)
	{

	}

	public function inviteUserByEmail(string $email)
	{

	}

	public function generateInvitationLink()
	{

	}

	public function revokeInvitationLink()
	{

	}
}