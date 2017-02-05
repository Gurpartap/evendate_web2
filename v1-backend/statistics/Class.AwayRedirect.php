<?php

class AwayRedirect{

	public static function addAway(array $request){
		$q_ins_away = App::queryFactory()->newInsert();
		$q_ins_away->into('stat_external_link_opens')
			->cols(array(
				'user_id' => $request['user_id'] ?? null,
				'url' => $request['url'] ?? null,
				'params' => json_encode($request)
			));
		$p_ins = App::DB()->prepare($q_ins_away->getStatement());
		$p_ins->execute($q_ins_away->getBindValues());
	}
}