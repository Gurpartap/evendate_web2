<?php


class ElasticUpdater
{

	protected $client;

	/**
	 * ElasticUpdater constructor.
	 */
	public function __construct()
	{
		$this->client = ClientBuilder::create()->build();

	}

	public function dropIndex($name){

	}

	public function createIndex(){

	}


	public function recreateIndex($name)
	{
		$this->dropIndex($name);
		$this->createIndex($name);
	}

}