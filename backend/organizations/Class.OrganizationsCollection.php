<?php

class OrganizationsCollection{

	private $db;
	private $user;

	public function __construct(PDO $db, User $user = null){
		$this->db = $db;
		$this->user = $user;
	}

	public function setUser(User $user){
		$this->user = $user;
	}

	public static function filter(PDO $db, User $user, array $filters = null, $order_by = ''){
		$q_get_organizations = 'SELECT DISTINCT organizations.id, organizations.description,
			organizations.background_medium_img_url, organizations.background_small_img_url,
			organizations.img_medium_url, organizations.img_small_url,
			organizations.name, organizations.type_id, organizations.img_url, organizations.background_img_url,
			 organizations.status, organizations.short_name, organization_types.name AS type_name,
			 organizations.updated_at,
			 organizations.created_at, subscriptions.id AS subscription_id,
			 IF(subscriptions.id IS NOT NULL, 1, 0) AS is_subscribed,
			 UNIX_TIMESTAMP(organizations.updated_at) AS timestamp_updated_at,
			 UNIX_TIMESTAMP(organizations.created_at) AS timestamp_created_at,
			(
				SELECT COUNT(id) AS subscribed_count
				FROM subscriptions
				WHERE subscriptions.status = 1
				AND subscriptions.organization_id = organizations.id
			) as subscribed_count
			FROM organizations
			INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = 1
			LEFT JOIN subscriptions ON subscriptions.organization_id = organizations.id AND subscriptions.user_id = :user_id AND subscriptions.status = 1
			WHERE 1 = 1 ';

		$statement_array = array(':user_id' => $user->getId());

		$search_fields = [];

		foreach($filters as $name => $value) {
			switch ($name) {
				case 'name': {
					$search_fields[] = ' organizations.name LIKE :name';
					$statement_array[':name'] = '%' . $value . '%';
					break;
				}
				case 'description': {
					$search_fields[] = ' organizations.description LIKE :description';
					$statement_array[':description'] = '%' . $value . '%';
					break;
				}
				case 'short_name': {
					$search_fields[] = ' organizations.short_name LIKE :short_name';
					$statement_array[':short_name'] = '%' . $value . '%';
					break;
				}
			}
		}

		if (count($search_fields) > 0){
			$q_get_organizations .= ' AND (' . implode(' OR ',$search_fields) . ')';
		}

		$q_get_organizations .= $order_by;

		$p_search = $db->prepare($q_get_organizations);
		$p_search->execute($statement_array);
		$organizations = $p_search->fetchAll();
		foreach($organizations as &$org){
			$org = Organization::normalizeOrganization($org);
			$org['subscribed_friends'] = Organization::getSubscribedFriends($db, $user, $org['id'])->getData();
		}
		return new Result(true, '', $organizations);
	}
}