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
		if (!$this->user) throw new InvalidArgumentException('USER_IS_NOT_DEFINED');
		$q_get_subscriptions = 'SELECT
			view_organizations.id::int,
			view_organizations.name,
			view_organizations.type_id::int,
			view_organizations.status::boolean,
			view_organizations.created_at,
			view_organizations.updated_at,
			view_organizations.img_url,
			view_organizations.description,
			view_organizations.short_name,
			view_organizations.background_img_url,
			view_organizations.site_url,
			view_organizations.type_name,
			 subscriptions.organization_id::int,
			 subscriptions.id::int AS subscription_id,
			 subscriptions.user_id::int,
			subscriptions.status::boolean as subscription_status,
			subscriptions.created_at as subscription_created_at,
			subscriptions.updated_at as subscription_updated_at,
			(
				SELECT COUNT(id)::int AS subscribed_count
				FROM subscriptions
				WHERE subscriptions.status = 1
				AND subscriptions.organization_id = organizations.id
			) as subscribed_count
			FROM organizations
			INNER JOIN subscriptions ON subscriptions.organization_id = organizations.id
			WHERE organizations.status = TRUE
			AND subscriptions.status = TRUE
			AND subscriptions.user_id = :user_id';

		$p_subs = $this->db->prepare($q_get_subscriptions);
		$result = $p_subs->execute(array(
			':user_id' => $this->user->getId()
		));
		if ($result === FALSE) throw new DBQueryException('QUERY_ERROR',$this->db);
		$subs = $p_subs->fetchAll();
		$normalized_subs = array();
		foreach($subs as $sub){
			$normalized_subs[] = array(
				'id' => $sub['subscription_id'],
				'organization_id' => $sub['organization_id'],
				'user_id' => $sub['user_id'],
				'subscription_status' => $sub['subscription_status'],
				'created_at' => $sub['subscription_created_at'],
				'updated_at' => $sub['subscription_updated_at'],
				'organization' => array(
					'id' => $sub['id'],
					'name' => $sub['name'],
					'status' => $sub['status'],
					'type_id' => $sub['type_id'],
					'img_url' => $sub['img_url'],
					'description' => $sub['description'],
					'short_name' => $sub['short_name'],
					'background_img_url' => $sub['background_img_url'],
					'site_url' => $sub['site_url'],
					'organization_type' => $sub['type_name'],
					'created_at' => $sub['created_at'],
					'updated_at' => $sub['updated_at'],
				)
			);
		}
		return new Result(true, '', $normalized_subs);
	}
}