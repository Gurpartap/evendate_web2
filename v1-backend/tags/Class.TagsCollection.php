<?php

class TagsCollection{

	private static function normalizeTag(array $tag){
		$tag['id'] = intval($tag['id']);
		$tag['status'] = $tag['status'] == 1;
		return $tag;
	}


	public static function all(PDO $db, $order_by = '', User $user = null){

		$res_array = array(
			'tags' => $db->query('SELECT * FROM tags WHERE status = 1 ' . $order_by)->fetchAll(),
			'organizations' => array()
		);

		if ($user instanceof User){
			$p_get_organizations = $db->prepare('SELECT DISTINCT organizations.name, organizations.id, organizations.img_url,
				organizations.short_name, organizations.default_address
 			    FROM  organizations
 			     INNER JOIN users_organizations ON users_organizations.organization_id = organizations.id
				WHERE users_organizations.status = 1
				AND users_organizations.user_id = :user_id');

			$res = $p_get_organizations->execute(array(':user_id' => $user->getId()));
			if ($res !== FALSE){
				$res_array['organizations'] = $p_get_organizations->fetchAll();
			}
		}

		foreach($res_array['tags'] as &$tag){
			$tag = self::normalizeTag($tag);
		}

		return new Result(true, '', $res_array);
	}

	public static function search($name, PDO $db, $order_by = '', User $user) {
		$q_get_tags = 'SELECT *
			FROM tags
			WHERE name
			LIKE :name ' . $order_by;
		$p_get_tags = $db->prepare($q_get_tags);
		$p_get_tags->execute(array(
			':name' => $name . '%'
		));

		$res_array  = $p_get_tags->fetchAll();
		foreach($res_array as &$tag){
			$tag = self::normalizeTag($tag);
		}

		return new Result(true, '', $res_array);
	}

}