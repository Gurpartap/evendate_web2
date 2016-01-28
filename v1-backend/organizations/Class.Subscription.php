<?php
/**
 * Created by PhpStorm.
 * User: Инал
 * Date: 13.07.2015
 * Time: 0:48
 */

class Subscription extends Organization{

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
		Statistics::Organization($this, $user, $this->db, Statistics::ORGANIZATION_UNSUBSCRIBE);
		return new Result(true, 'Подписка успешно отменена');
	}

}