<?php

require_once "{$BACKEND_FULL_PATH}/vendor/autoload.php";
use Elasticsearch\ClientBuilder;

abstract class AbstractCollection
{

	public abstract static function filter(ExtendedPDO $db,
																				 AbstractUser $user = null,
																				 array $filters = null,
																				 array $fields = null,
																				 array $pagination = null,
																				 array $order_by = array('created_at'));


	public static function one(ExtendedPDO $db,
														 AbstractUser $user,
														 int $id,
														 array $fields = null)
	{

		return static::filter($db, $user, array('id' => $id), $fields);
	}

	public static function dropElasticIndex()
	{
		$client = ClientBuilder::create()->build();

		$params = ['index' => strtolower(get_class() . 's')];
		$response = $client->indices()->delete($params);
		return $response;

	}

	public static function createElasticIndex()
	{

	}

	public static function reindexCollection(ExtendedPDO $__db, AbstractUser $__user)
	{

	}
}