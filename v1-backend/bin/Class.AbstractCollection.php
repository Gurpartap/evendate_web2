<?php

abstract class AbstractCollection{

	public abstract static function filter(ExtendedPDO $db,
																				 AbstractUser $user = null,
																				 array $filters = null,
																				 array $fields = null,
																				 array $pagination = null,
																				 array $order_by = array('created_at'));


	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
	                           int $id,
	                           array $fields = null){

		return static::filter($db, $user, array('id' => $id), $fields);
	}
}