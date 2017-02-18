<?php
require_once 'env_variables.php';

@session_start();
require_once $BACKEND_FULL_PATH . '/bin/app_config.php';
require_once $BACKEND_FULL_PATH . '/vendor/aurasql/autoload.php';
App::init();

$driver_options = array(
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
);
if (!isset($_SERVER['ENV']) || $_SERVER['ENV'] == 'dev' || $_SERVER['ENV'] == 'local') {
	$driver_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
}

class ExtendedPDO extends PDO
{

	public function prepareExecute(Aura\SqlQuery\QueryInterface $query, $error_name = 'QUERY_ERROR', array $bind_values = array()) : PDOStatement
	{
		$prep = $this->prepare($query->getStatement());
		if ($bind_values == null) {
			$bind_values = $query->getBindValues();
		}
		$result = $prep->execute($bind_values);
		if ($result === FALSE) {
			throw new DBQueryException($error_name, $this);
		}
		return $prep;
	}
}

$__db = new ExtendedPDO(App::$DB_DSN, App::$DB_USER, App::$DB_PASSWORD, $driver_options);