<?php

class TagsCollection{





	public static function all(PDO $db, User $user = null){

		$res_array = array(
			'tags' => $db->query('SELECT * FROM tags WHERE status = 1 ORDER BY tags.name')->fetchAll(),
			'organizations' => array()
		);

		if ($user instanceof User){
			$p_get_organizations = $db->prepare('SELECT DISTINCT organizations.name, organizations.id, organizations.img_url,
			organizations.short_name
 			FROM  organizations
 			 INNER JOIN users_organizations ON users_organizations.organization_id = organizations.id
			WHERE users_organizations.status = 1
			AND users_organizations.user_id = :user_id
			ORDER BY organizations.name ASC');

			$res = $p_get_organizations->execute(array(':user_id' => $user->getId()));
			if ($res !== FALSE){
				$res_array['organizations'] = $p_get_organizations->fetchAll();
			}
		}

		return new Result(true, '', $res_array);
	}

}