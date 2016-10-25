<?php

abstract class AbstractEntity
{

	protected static $DEFAULT_COLS = array();
	protected static $ADDITIONAL_COLS = array();
	protected $id;
	protected $db;


	public function getParams(AbstractUser $user = null, array $fields = null) : Result
	{
		$result_data = array();

		foreach (static::$DEFAULT_COLS as $field) {
			if (property_exists($this, $field)) {
				$result_data[$field] = $this->$field;
			}
		}

		foreach ($fields as $name => $value) {
			if ((in_array($name, static::$ADDITIONAL_COLS) || isset(static::$ADDITIONAL_COLS[$name]))) {
				if (is_numeric($name)) {
					$result_data[$value] = $this->$value;
				} else {
					$result_data[$name] = $this->$name;
				}
			}
		}

		return new Result(true, '', $result_data);
	}

	public static function getDefaultCols()
	{
		return static::$DEFAULT_COLS;
	}

	public static function getAdditionalCols()
	{
		return static::$ADDITIONAL_COLS;
	}

	public function getId() : int
	{
		return $this->id;
	}
}