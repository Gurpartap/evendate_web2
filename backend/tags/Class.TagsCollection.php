<?php

class TagsCollection{





	public static function all(PDO $db){
		$result = $db->query('SELECT * FROM tags WHERE status = 1');
		return new Result(true, '', $result->fetchAll());
	}

}