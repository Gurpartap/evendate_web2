<?php


class PrivateOrganization extends Organization
{

	const INVITED_USERS_FIELD_NAME = 'invited_users';
	const INVITATION_LINKS_FIELD_NAME = 'invitation_links';


	private function inviteUser($email = null, User $user, UserInterface $friend = null)
	{

		if ($user->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);
		if ($email == null && $friend == null) throw new InvalidArgumentException('CANT_FIND_USER');

		$q_ins_invitation = App::queryFactory()->newInsert()
			->into('organizations_invitations')
			->cols(array(
				'organization_id' => $this->getId(),
				'user_id' => $friend instanceof UserInterface ? $friend->getId() : null,
				'creator_id' => $user->getId(),
				'email' => $email
			))
			->onConflictUpdate(array('organization_id', 'user_id', 'email'), array(
				'status' => 'true',
				'creator_id' => $user->getId()
			))
			->returning(array('uuid'));
		$p_ins_invitation = $this->db->prepareExecute($q_ins_invitation, 'CANT_INSERT_INVITATION');
		return new Result(true, '', array(
			'uuid' => $p_ins_invitation->fetchColumn(0)
		));
	}

	public function revokeInvitation(User $user, $uuid)
	{
		if ($user->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);
		$q_upd_invitation = App::queryFactory()->newUpdate()
			->table('organizations_invitations')
			->cols(array(
				'status' => 'false'
			))
			->where('uuid = ?', $uuid);
		$this->db->prepareExecute($q_upd_invitation, 'CANT_REVOKE_INVITATION');
		return new Result(true);
	}

	public function inviteUserByEmail(string $email, User $user)
	{
		return $this->inviteUser($email, $user);
	}

	public function inviteUserById($friend_id, User $user)
	{
		return $this->inviteUser(null, $user, UsersCollection::one(
			$this->db,
			$user,
			$friend_id,
			array()
		));
	}

	public function createInvitationLink(User $user)
	{
		if ($user->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);

		$q_ins_invitation = App::queryFactory()->newInsert()
			->into('organizations_invitation_links')
			->cols(array(
				'organization_id' => $this->getId(),
				'creator_id' => $user->getId(),
				'status' => 'true'
			))
			->returning(array(
				'uuid'
			));
		$p_ins_invitation = $this->db->prepareExecute($q_ins_invitation, 'CANT_INSERT_INVITATION');
		return new Result(true, '', array(
			'uuid' => $p_ins_invitation->fetchColumn(0)
		));
	}

	public function revokeInvitationLink(User $user, $uuid)
	{
		if ($user->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);

		$q_upd_invitation = App::queryFactory()->newUpdate()
			->table('organizations_invitation_links')
			->cols(array(
				'status' => 'false'
			))
			->where('uuid = ? ', $uuid);
		$this->db->prepareExecute($q_upd_invitation, 'CANT_UPDATE_INVITATION');
		return new Result(true, '');

	}

	public function getInvitationLinks(User $user, array $fields = null, array $order_by = null)
	{
		if ($user->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);

		$_fields = Fields::mergeFields(array(
			'creator_id',
			'created_at',
			'updated_at',
			'creator_first_name',
			'creator_last_name',
			'creator_avatar_url',
		), $fields ?? array(), array(
			'organization_id',
			'creator_id',
			'uuid'
		));
		$q_get_links = App::queryFactory()
			->newSelect()
			->cols($_fields)
			->from('view_invitation_links')
			->where('organization_id = ?', $this->getId())
			->where('status = true')
			->orderBy($order_by ?? array());
		$p_get_links = $this->db->prepareExecute($q_get_links, 'CANT_GET_INVITATIONS');
		return new Result(true, '', $p_get_links->fetchAll());
	}

	public function getInvitedUsers(User $user, array $fields, array $order_by)
	{
		if ($user->isAdmin($this) == false) throw new PrivilegesException('NOT_ADMIN', $this->db);
		$_fields = Fields::mergeFields(array(
			'organization_id',
			'user_id',
			'creator_id',
			'email',
			'uuid',

			'user_first_name',
			'user_last_name',
			'user_avatar_url',
			'creator_first_name',
			'creator_last_name',
			'creator_avatar_url',
			'created_at',
			'updated_at',
			'invited_by_email',
			'invited_by_user_id',
		), $fields, array(
			'organization_id',
			'creator_id',
			'uuid',
			'email',
			'user_id'
		));
		$q_get_links = App::queryFactory()
			->newSelect()
			->cols($_fields)
			->from('view_invited_users')
			->where('organization_id = ?', $this->getId())
			->where('status = true');
		$p_get_links = $this->db->prepareExecute($q_get_links, 'CANT_INSERT_INVITATION');
		return new Result(true, '', $p_get_links->fetchAll());
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::INVITATION_LINKS_FIELD_NAME])) {
			$result_data[self::INVITATION_LINKS_FIELD_NAME] = $this->getInvitationLinks($user,
				Fields::parseFields($fields[self::INVITATION_LINKS_FIELD_NAME]['fields'] ?? '')
			);
		}

		if (isset($fields[self::INVITED_USERS_FIELD_NAME])) {
			$result_data[self::INVITATION_LINKS_FIELD_NAME] = $this->getInvitationLinks($user,
				Fields::parseFields($fields[self::INVITATION_LINKS_FIELD_NAME]['fields'] ?? '')
			);
		}

		return new Result(true, '', $result_data);
	}

}