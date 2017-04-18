<?php

require_once $BACKEND_FULL_PATH . '/payments/Class.Tariff.php';


class Payment
{

	const SHOP_ID = '132896';
	const SC_ID = '97111';
	const PASSWORD = 'Kaz!uistika31415!926';
	const ACTION_CHECK_ORDER = 'checkOrder';
	const ACTION_PAYMENT_AVISO = 'paymentAviso';

	public static function createForOrganization(Organization $organization, User $user, ExtendedPDO $db, array $data)
	{
		if (!$user->isAdmin($organization)) throw new PrivilegesException(null, $db);
		$q_ins = App::queryFactory()->newInsert();
		$q_ins->into('organizations_payments')
			->cols(array(
				'organization_id' => $organization->getId(),
				'user_id' => $user->getId(),
				'sum' => Tariff::FULL_PRICE
			))->returning(array('uuid'));
		$uuid = $db->prepareExecute($q_ins, 'CANT_CREATE_PAYMENT')->fetchColumn(0);
		return new Result(true, '', array('uuid' => $uuid, 'sum' => Tariff::FULL_PRICE));
	}

	private static function buildResponse($type, $result_code, $message, $invoiceId)
	{
		$date = new DateTime();
		$performedDatetime = $date->format("Y-m-d") . "T" . $date->format("H:i:s") . ".000" . $date->format("P");
		$response = '<?xml version="1.0" encoding="UTF-8"?><' . $type . 'Response performedDatetime="' . $performedDatetime .
			'" code="' . $result_code . '" ' . ($message != null ? 'message="' . $message . '"' : "") . ' invoiceId="' . $invoiceId . '" shopId="' .
			self::SHOP_ID . '"/>';
		return $response;
	}

	private static function checkMd5(array $request)
	{
		$str = $request['action'] . ";" .
			$request['orderSumAmount'] . ";" . $request['orderSumCurrencyPaycash'] . ";" .
			$request['orderSumBankPaycash'] . ";" . $request['shopId'] . ";" .
			$request['invoiceId'] . ";" . trim($request['customerNumber']) . ";" . self::PASSWORD;
		$md5 = strtoupper(md5($str));
		return $md5 != strtoupper($request['md5']);

	}

	public static function checkPayment(array $request, ExtendedPDO $db)
	{
		if (!isset($request['evendate_payment_id'])) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 100, 'PAYMENT NOT FOUND', $request['invoiceId']);
		}

		if (!self::checkMd5($request)) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 101, 'MD5 ERROR', $request['invoiceId']);
		}

		$q_get = App::queryFactory()->newSelect();
		$q_get->from('organizations_payments')
			->cols(array(
				'organization_id',
				'user_id',
				'uuid',
				'sum'
			))->where('uuid = ?', $request['evendate_payment_id']);
		$payment = $db->prepareExecute($q_get, 'CANT_GET_PAYMENT');
		if ($payment->rowCount() != 1){
			return self::buildResponse(self::ACTION_CHECK_ORDER, 102, '', $request['invoiceId']);
		}
		$payment = $payment->fetch();

		if ($payment['sum'] != $request['orderSumAmount']) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 103, 'WRONG SUM', $request['invoiceId']);
		} else {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 0, 'ok', $request['invoiceId']);
		}

	}

}