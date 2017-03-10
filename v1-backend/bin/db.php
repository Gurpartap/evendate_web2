<?php
require_once 'env_variables.php';

@session_start();
require_once $BACKEND_FULL_PATH . '/bin/app_config.php';
require_once $BACKEND_FULL_PATH . '/vendor/aurasql/autoload.php';
App::init();

$driver_options = array(
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
);

class ExtendedPDO extends PDO
{

	private $query;
	private $values;

	public function getQueryInfo(){
		return array(
			'query' => $this->query,
			'values' => json_encode($this->values)
		);
	}

	private function handleError(Exception $e, $name)
	{
		throw new DBQueryException($e->getMessage(), $this, $name);
	}

	public function prepareExecute(Aura\SqlQuery\QueryInterface $query, $error_name = 'QUERY_ERROR', array $bind_values = array()): PDOStatement
	{
		$this->query = $query->getStatement();
		$prep = $this->prepare($query->getStatement());
		if ($bind_values == null) {
			$bind_values = $query->getBindValues();
			$this->values = $bind_values;
		} else {
			$this->values = $bind_values;
		}
		try {
			$prep->execute($bind_values);
		} catch (PDOException $e) {
			$this->handleError($e, $error_name);
		}
		return $prep;
	}

	public function prepareExecuteRaw(string $query, array $params, $error_name = 'QUERY_ERROR'): PDOStatement
	{
		$this->query = $query;
		$this->values = $params;
		$prep = $this->prepare($query);
		try {
			$prep->execute($params);
		} catch (PDOException $e) {
			$this->handleError($e, $error_name);
		}
		return $prep;
	}

	public function bulkPrepareExecuteRaw(string $query, array $rows, $error_name = 'QUERY_ERROR')
	{
		$prep = $this->prepare($query);
		try {
			foreach ($rows as $params) {
				$prep->execute($params);
			}
		} catch (PDOException $e) {
			$this->query = $query;
			$this->values = $params;
			$this->handleError($e, $error_name);
		}
		return $prep;
	}

}

$__db = new ExtendedPDO(App::$DB_DSN, App::$DB_USER, App::$DB_PASSWORD, $driver_options);