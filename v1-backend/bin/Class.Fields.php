<?php

class Fields{

	const COMMA_AT_END = 1;
	const COMMA_AT_BEGIN = 2;

	private static function getAvailableFields(array $possible, array $fields) : array{
		$result = array();
		foreach($fields as $field => $params){
			$field = trim($field);
			if (in_array($field, $possible)){
				$result[] = $field;
			}elseif (isset($possible[$field])){
				$result[] = $possible[$field];
			}
		}
		return $result;
	}

	public static  function buildAdditionalFields(array $possible, array $fields, $as_text = false, $comma = null){
		$result = self::getAvailableFields($possible, $fields);
		if ($as_text){
			$str = implode(', ', $result);
			$items = count($result);
			if ($comma == self::COMMA_AT_BEGIN && $items > 0){
				$str = ', '. $str;
			}elseif ($comma == self::COMMA_AT_END && $items > 0){
				$str = $str . ', ';
			}
			return $str;
		}else{
			return $result;
		}
	}

	public static function mergeFields(array $possible, array $fields, array $append_to, $as_text = false){
		$array =  array_merge($append_to, self::getAvailableFields($possible, $fields));
		if ($as_text){
			return implode(', ', $array);
		}else{
			return $array;
		}
	}

	public static function parseFields(string $fields) : array{
		// regexp from
		// http://stackoverflow.com/questions/15233953/php-split-string-on-comma-but-not-when-between-braces-or-quotes
		preg_match_all("/\{(?:[^{}]|(?R))+\}|'[^']*'|[^{},\s]+/", $fields, $matches);
		$result = array();
		$prev = null;
		foreach ($matches[0] as $field) {
			if (strpos($field, '{') === 0){
				$result[$prev] = self::queryJSONDecode(trim($field));
			}else{
				$result[$field] = array();
				$prev = $field;
			}
		}
		$result['pagination'] = array(
			$result['length'] ?? App::DEFAULT_LENGTH,
			$result['offset'] ?? App::DEFAULT_OFFSET,
		);
		return $result;
	}

	public static function appendTableName($table_name, array $fields) : array{
		foreach($fields as &$field){
			$field = $table_name . $field;
		}
		return $fields;
	}

	public static function queryJSONDecode($s){
		$s = str_replace(array("'"), array('"'), $s);
		$s = preg_replace('/(\w+):/i', '"\1":', $s);
		return json_decode($s, true);
	}

	public static function parseOrderBy(string $fields = null) : array{
		$result = array();
		if (is_null($fields) || empty($fields)) return $result;
		$fields = explode(',', $fields);
		foreach($fields as &$field){
			$field = trim($field);
			if (substr($field, 0, 1) == '-'){
				$field = ltrim($field, '-');
				$result[] = $field . ' DESC';
			}else{
				$result[] = $field;
			}
		}
		return $result;
	}
}