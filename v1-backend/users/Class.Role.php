<?php

class Roles{
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

    public static function getId($role){
        if (!in_array($role, self::ROLES)) throw new InvalidArgumentException('CANT_FIND_ROLE');
        return self::ROLE_IDS[$role];
    }
}