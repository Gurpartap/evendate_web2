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

    public static function getId($role)
    {
        if (!in_array($role, self::ROLES)) throw new InvalidArgumentException('CANT_FIND_ROLE');
        return self::ROLE_IDS[$role];
    }

    public static function getUsersPrivilegesInOrganization(User $user, Organization $organization, PDO $db)
    {
        $q_get_privileges = App::queryFactory()
            ->newSelect()
            ->from('view_privileges')
        ->cols(array('role_id', 'name'))
        ->where('user_id = ?', $user->getId())
        ->where('organization_id = ?', $organization->getId());

        $p_get_privileges = $db->prepare($q_get_privileges->getStatement());
        $result = $p_get_privileges->execute($q_get_privileges->getBindValues());

        if ($result === FALSE) throw new DBQueryException('CANT_GET_PRIVILEGES', $db);

        return new Result(true, '', $p_get_privileges->fetchAll());
    }
}