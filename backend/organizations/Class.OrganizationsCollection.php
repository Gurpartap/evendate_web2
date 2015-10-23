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

	public function getAllActive(){
		$q_get_organizations = 'SELECT organizations.id, organizations.description,
			organizations.name, organizations.type_id, organizations.img_url, organizations.background_img_url,
			 organizations.status, organizations.short_name, organization_types.name AS type_name,
			 organizations.background_medium_img_url, organizations.background_small_img_url,
			 organizations.img_medium_url, organizations.img_small_url,
			 organizations.updated_at,
			 organizations.created_at,
			 UNIX_TIMESTAMP(organizations.updated_at) AS timestamp_updated_at,
			 UNIX_TIMESTAMP(organizations.created_at) AS timestamp_created_at,
			(
				SELECT COUNT(id) AS subscribed_count
				FROM subscriptions
				WHERE subscriptions.status = 1
				AND subscriptions.organization_id = organizations.id
			) as subscribed_count
			FROM organizations
			INNER JOIN organization_types ON organization_types.id = organizations.type_id
			WHERE organizations.status = 1
			ORDER BY id DESC';
		$result = $this->db->query($q_get_organizations);

		$orgs = $result->fetchAll();

		foreach($orgs as &$org){
			$org = Organization::normalizeOrganization($org);
		}
		return new Result(true, '', $orgs);
	}

	public function getUserOrganizations(){
		if ($this->user instanceof User == false) throw new InvalidArgumentException('USER_IS_NOT_DEFINED');
		$q_get_subscriptions = 'SELECT
			organizations.name, organizations.type_id, organizations.background_img_url,
			 organizations.status, organizations.short_name, subscriptions.organization_id, subscriptions.id AS subscription_id,
			subscriptions.status as subscription_status,
			 organizations.updated_at,
			 organizations.created_at,
			 UNIX_TIMESTAMP(organizations.updated_at) AS timestamp_updated_at,
			 UNIX_TIMESTAMP(organizations.created_at) AS timestamp_created_at,
			(
				SELECT COUNT(id) AS subscribed_count
				FROM subscriptions
				WHERE subscriptions.status = 1
				AND subscriptions.organization_id = organizations.id
			) as subscribed_count
			FROM organizations
			INNER JOIN subscriptions ON subscriptions.organization_id = organizations.id
			WHERE organizations.status = 1
			AND subscriptions.status = 1
			AND subscriptions.user_id = :user_id
			ORDER BY subscriptions.created_at, subscriptions.updated_at';

		$p_subs = $this->db->prepare($q_get_subscriptions);
		$result = $p_subs->execute(array(
			':user_id' => $this->user->getId()
		));
		if ($result === FALSE) throw new DBQueryException('QUERY_ERROR',$this->db);
		$subs = $p_subs->fetchAll();
		$normalized_subs = array();
		foreach($subs as &$sub){
			$normalized_subs["{$sub['organization_id']}"] = $sub['subscription_id'];
		}

		$organizations = $this->getAllActive()->getData();

		foreach($organizations as &$organization){
			if (isset($normalized_subs["{$organization['id']}"])){
				$subscribed = true;
				$subscription_id = (int) $normalized_subs["{$organization['id']}"];
			}else{
				$subscribed = false;
				$subscription_id = null;
			}
			$organization['is_subscribed'] = $subscribed;
			$organization['subscription_id'] = $subscription_id;
		}
		return new Result(true, '', $organizations);
	}

	public static function filter(PDO $db, User $user, array $filters = null, $order_by = ''){
		$q_get_organizations = 'SELECT organizations.id, organizations.description,
			organizations.background_medium_img_url, organizations.background_small_img_url,
			organizations.img_medium_url, organizations.img_small_url,
			organizations.name, organizations.type_id, organizations.img_url, organizations.background_img_url,
			 organizations.status, organizations.short_name, organization_types.name AS type_name,
			 organizations.updated_at,
			 organizations.created_at,
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
			WHERE organizations.type_id = -1';

		$statement_array = array();
		foreach($filters as $name => $value) {
			switch ($name) {
				case 'name': {
					$q_get_organizations .= ' OR organizations.name LIKE :name';
					$statement_array[':name'] = '%' . $value . '%';
					break;
				}
				case 'description': {
					$q_get_organizations .= ' OR organizations.description LIKE :description';
					$statement_array[':description'] = '%' . $value . '%';
					break;
				}
				case 'short_name': {
					$q_get_organizations .= ' OR organizations.short_name LIKE :short_name';
					$statement_array[':short_name'] = '%' . $value . '%';
					break;
				}
			}
		}
		$p_search = $db->prepare($q_get_organizations);
		$p_search->execute($statement_array);
		$organizations = $p_search->fetchAll();
		foreach($organizations as &$org){
			$org = Organization::normalizeOrganization($org);
		}
		return new Result(true, '', $organizations);
	}
}