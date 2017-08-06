<?php

class Emails
{

	public static function schedule($type_code, $recipient, $data)
	{
		file_put_contents('php://stderr', print_r(array($type_code, $recipient, $data)));
		$q_get_type_id = App::queryFactory()->newSelect();
		$q_get_type_id->from('email_types')
			->cols(array('id'))
			->where('type_code = ? ', $type_code);
		$type_id = App::DB()->prepareExecute($q_get_type_id, 'CANT_GET_EMAIL_TYPE_ID')->fetchColumn(0);

		$q_ins_email = App::queryFactory()->newInsert();
		$q_ins_email->into('emails')
			->cols(array(
				'email_type_id' => $type_id,
				'recipient' => $recipient,
				'data' => json_encode($data),
				'status' => 'true'
			));



		App::DB()->prepareExecute($q_ins_email, 'CANT_INSERT_EMAIL');
	}

}