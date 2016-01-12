<?php

class Fields{

	const COMMA_AT_END = 1;
	const COMMA_AT_BEGIN = 2;

	static private function getAvailableFields(array $possible, array $fields){
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

	static public function buildAdditionalFields(array $possible, array $fields, $as_text = false, $comma = null){
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

	static public function mergeFields(array $possible, array $fields, array $append_to, $as_text = false){
		$array =  array_merge($append_to, self::getAvailableFields($possible, $fields));
		if ($as_text){
			return implode(', ', $array);
		}else{
			return $array;
		}
	}
}