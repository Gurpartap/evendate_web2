<?php
/**
 * Created by PhpStorm.
 * User: Инал
 * Date: 13.07.2015
 * Time: 0:48
 */

class Subscription{

	private $id;
	private $organization_id;
	private $status;
	private $user_id;


	public function __construct($id, PDO $db) {
		$p_get_sub = $db->prepare('SELECT id::int, organization_id::int,
			user_id::int, status::BOOLEAN
			FROM subscriptions
			WHERE subscriptions.id = :id');

		$result = $p_get_sub->execute(array(
			':id' => $id
		));

		if ($result === FALSE) throw new DBQueryException('CANT_GET_SUB_QUERY_ERROR', $db);
		if ($p_get_sub->rowCount() != 1) throw new InvalidArgumentException('CANT_GET_SUB');

		$row = $p_get_sub->fetch();
		$this->db = $db;
		$this->id = $row['id'];
		$this->status = $row['status'];
		$this->organization_id = $row['organization_id'];
		$this->user_id = $row['user_id'];
		$this->status = $row['status'];
	}

	private function getOrganization(){
		return new Organization($this->organization_id, $this->db);
	}

	public static function create(User $user, Organization $organization, PDO $db){
		$q_ins_sub = 'INSERT INTO subscriptions(organization_id, user_id, created_at, `status`)
			VALUES(:organization_id, :user_id, NOW(), 1)
			ON CONFLICT DO UPDATE SET status = TRUE RETURNING id;';

		$p_ins_sub = $db->prepare($q_ins_sub);
		$result = $p_ins_sub->execute(array(
			':organization_id' => $organization->getId(),
			':user_id' => $user->getId()
		));

		if ($result === FALSE) throw new DBQueryException('SUBSCRIPTION_QUERY_ERROR', $db);

		$sub_id = $db->lastInsertId();
		Statistics::Organization($organization, $user, $db, Statistics::ORGANIZATION_SUBSCRIBE);

		return new Result(true, 'Подписка успешно оформлена', array('subscription_id' => intval($sub_id)));
	}

	public function delete(User $user){
		$q_upd_sub = 'UPDATE subscriptions
			SET status = FALSE
			WHERE user_id = :user_id
			AND id = :id';
		$p_upd_sub = $this->db->prepare($q_upd_sub);
		$p_upd_sub->execute(array(
			':id' => $this->id,
			':user_id' => $user->getId()
		));
		Statistics::Organization($this->getOrganization(), $user, $this->db, Statistics::ORGANIZATION_UNSUBSCRIBE);
		return new Result(true, 'Подписка успешно отменена');
	}


}