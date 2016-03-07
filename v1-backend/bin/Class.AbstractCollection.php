<?php

abstract class AbstractCollection{

	public abstract static function filter(PDO $db,
	                                       User $user = null,
	                                       array $filters = null,
	                                       array $fields = null,
	                                       array $pagination = null,
	                                       array $order_by = array('created_at'));


	public static function one(PDO $db,
	                           User $user,
	                           int $id,
	                           array $fields = null){

		return static::filter($db, $user, array('id' => $id), $fields);
	}
}