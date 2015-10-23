<?php

class SubscriptionsCollection{
	private $db;
	private $user;


	/**
	 * SubscriptionsCollection constructor.
	 * @param PDO $db
	 * @param User $user
	 */
	public function __construct(PDO $db, User $user) {
		$this->db = $db;
		$this->user = $user;
	}

	public function get(){
		if ($this->user instanceof User == false) throw new InvalidArgumentException('USER_IS_NOT_DEFINED');
		$q_get_subscriptions = 'SELECT
			organizations.*, organization_types.name as organization_type,
			 subscriptions.organization_id,
			 subscriptions.id AS subscription_id,
			 subscriptions.user_id,
			subscriptions.status as subscription_status,
			subscriptions.created_at as subscription_created_at,
			subscriptions.updated_at as subscription_updated_at,
			(
				SELECT COUNT(id) AS subscribed_count
				FROM subscriptions
				WHERE subscriptions.status = 1
				AND subscriptions.organization_id = organizations.id
			) as subscribed_count
			FROM organizations
			INNER JOIN subscriptions ON subscriptions.organization_id = organizations.id
			INNER JOIN organization_types ON organization_types.id = organizations.type_id
			WHERE organizations.status = 1
			AND subscriptions.status = 1
			AND subscriptions.user_id = :user_id';

		$p_subs = $this->db->prepare($q_get_subscriptions);
		$result = $p_subs->execute(array(
			':user_id' => $this->user->getId()
		));
		if ($result === FALSE) throw new DBQueryException('QUERY_ERROR',$this->db);
		$subs = $p_subs->fetchAll();
		$normalized_subs = array();
		foreach($subs as &$sub){
			$normalized_subs[] = array(
				'id' => (int) $sub['subscription_id'],
				'organization_id' => (int) $sub['organization_id'],
				'user_id' => (int) $sub['user_id'],
				'subscription_status' => (boolean) $sub['subscription_status'],
				'created_at' => $sub['subscription_created_at'],
				'updated_at' => $sub['subscription_updated_at'],
				'organization' => Organization::normalizeOrganization(array(
					'id' => $sub['id'],
					'name' => $sub['name'],
					'status' => $sub['status'],
					'type_id' => $sub['type_id'],
					'created_at' => $sub['created_at'],
					'updated_at' => $sub['updated_at'],
					'img_url' => $sub['img_url'],
					'description' => $sub['description'],
					'short_name' => $sub['short_name'],
					'background_img_url' => $sub['background_img_url'],
					'site_url' => $sub['site_url'],
					'organization_type' => $sub['organization_type'],
				))
			);
		}
		return new Result(true, '', $normalized_subs);
	}
}