<?php

class Roles
{
	const ROLE_ADMIN = 'admin';
	const ROLE_MODERATOR = 'moderator';
	const ROLE_ADMIN_ID = 1;
	const ROLE_MODERATOR_ID = 2;

	const ROLES = array(
		self::ROLE_ADMIN,
		self::ROLE_MODERATOR
	);

	const ROLE_IDS = array(
		self::ROLE_ADMIN => self::ROLE_ADMIN_ID,
		self::ROLE_MODERATOR => self::ROLE_MODERATOR_ID
	);

	const PRIVILEGES_COLS = array('role_id', 'name');

	public static function getId($role)
	{
		if (!in_array($role, self::ROLES)) throw new InvalidArgumentException('CANT_FIND_ROLE');
		return self::ROLE_IDS[$role];
	}

	public static function getUsersPrivilegesInOrganization(User $user, Organization $organization, ExtendedPDO $db)
	{
		$q_get_privileges = App::queryFactory()
			->newSelect();
		$q_get_privileges->from('view_privileges')
			->cols(self::PRIVILEGES_COLS)
			->where('user_id = ?', $user->getId())
			->where('organization_id = ?', $organization->getId());

		$p_get_privileges = $db->prepareExecute($q_get_privileges, 'CANT_GET_PRIVILEGES');

		return new Result(true, '', $p_get_privileges->fetchAll());
	}
}