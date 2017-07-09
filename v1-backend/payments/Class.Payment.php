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
		if (!$user->hasRights($organization, array(Roles::ROLE_ADMIN, Roles::ROLE_MODERATOR))) throw new PrivilegesException(null, $db);
		$q_ins = App::queryFactory()->newInsert();
		$q_ins->into('organizations_payments')
			->cols(array(
				'organization_id' => $organization->getId(),
				'user_id' => $user->getId(),
				'sum' => Tariff::FULL_PRICE //TODO: Getting this var from db
			))->returning(array('uuid'));
		$uuid = $db->prepareExecute($q_ins, 'CANT_CREATE_PAYMENT')->fetchColumn(0);
		return new Result(true, '', array('uuid' => $uuid, 'sum' => Tariff::FULL_PRICE));
	}

	public static function buildResponse($type, $result_code, $message, $invoiceId)
	{
		$date = new DateTime();
		$performedDatetime = $date->format("Y-m-d") . "T" . $date->format("H:i:s") . ".000" . $date->format("P");
		$response = '<?xml version="1.0" encoding="UTF-8"?><' . $type . 'Response performedDatetime="' . $performedDatetime .
			'" code="' . $result_code . '" ' . ($message != null ? 'message="' . $message . '"' : "") . ' invoiceId="' . $invoiceId . '" shopId="' .
			self::SHOP_ID . '"/>';
		return $response;
	}

	public static function checkMd5(array $request)
	{
		$str = $request['action'] . ";" .
			$request['orderSumAmount'] . ";" . $request['orderSumCurrencyPaycash'] . ";" .
			$request['orderSumBankPaycash'] . ";" . $request['shopId'] . ";" .
			$request['invoiceId'] . ";" . trim($request['customerNumber']) . ";" . self::PASSWORD;
		$md5 = strtoupper(md5($str));
		return $md5 == strtoupper($request['md5']);

	}

	private static function getPaymentInfo(ExtendedPDO $db, array $request)
	{

		if (!isset($request['evendate_payment_id'])) throw new NoMethodException('', $db);


		if (!self::checkMd5($request)) throw new BadArgumentException('BAD_MD5', $db);


		$q_get = App::queryFactory()->newSelect();
		$q_get->from('organizations_payments')
			->cols(array(
				'id',
				'organization_id',
				'user_id',
				'uuid',
				'sum'
			))->where('uuid = ?', $request['evendate_payment_id']);
		$payment = $db->prepareExecute($q_get, 'CANT_GET_PAYMENT');

		if ($payment->rowCount() != 1) throw new LogicException('BAD_UUID');
		$payment = $payment->fetch();
		if ((int)$payment['sum'] != (int)$request['orderSumAmount']) throw new InvalidArgumentException('BAD_SUM');

		return $payment;
	}

	public static function checkPayment(array $request, ExtendedPDO $db)
	{
			try {

			$payment = self::getPaymentInfo($db, $request);
			return self::buildResponse(self::ACTION_CHECK_ORDER, 0, 'ok', $request['invoiceId']);

		} catch (NoMethodException $nmte) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 100, 'PAYMENT NOT FOUND', $request['invoiceId']);
		} catch (BadArgumentException $be) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 1, 'MD5 ERROR', $request['invoiceId']);
		} catch (InvalidArgumentException $ie) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 100, 'WRONG SUM', $request['invoiceId']);
		} catch (Exception $e) {
			return self::buildResponse(self::ACTION_CHECK_ORDER, 100, '', $request['invoiceId']);
		}
	}

	private static function getPayedTill(ExtendedPDO $db, $organization_id): DateTime
	{
		$q_get = App::queryFactory()->newSelect();
		$q_get->from('view_payments')
			->cols(array(
				'till'
			))
			->where('organization_id =? ', $organization_id)
			->where('status = true')
			->orderBy(array('till DESC'));

		$info = $db->prepareExecute($q_get, 'CANT_GET_PAYED_TILL');

		if ($info->rowCount() == 0) return new DateTime();
		return new DateTime($info->fetchColumn(0));
	}

	public static function avisoPayment(array $request, ExtendedPDO $db)
	{
		try {

			$payment = self::getPaymentInfo($db, $request);

			$q_upd = App::queryFactory()->newUpdate();

			$q_upd->table('organizations_payments')
				->cols(array(
					'finished' => 'true',
					'aviso_data' => json_encode($request)
				))
				->set('payed_at', 'NOW()')
				->where('uuid = ?', $request['evendate_payment_id']);
			$db->prepareExecute($q_upd, 'CANT_UPDATE_PAYMENT');

			$q_ins = App::queryFactory()->newInsert();

			$payed_till = self::getPayedTill($db, $payment['organization_id']);

			$q_ins->into('organizations_tariffs')
				->cols(array(
					'payment_id' => $payment['id'],
					'tariff_id' => Tariff::FULL_ID,
					'since' => $payed_till->format(APP::DB_DATETIME_FORMAT),
					'till' => $payed_till->add(new DateInterval('P1M'))->format(APP::DB_DATETIME_FORMAT)
				));

			$db->prepareExecute($q_ins, 'CANT_INSERT_PAYMENT');


			return self::buildResponse(self::ACTION_PAYMENT_AVISO, 0, 'ok', $request['invoiceId']);

		} catch (NoMethodException $nmte) {
			return self::buildResponse(self::ACTION_PAYMENT_AVISO, 100, 'PAYMENT NOT FOUND', $request['invoiceId']);
		} catch (BadArgumentException $be) {
			return self::buildResponse(self::ACTION_PAYMENT_AVISO, 1, 'MD5 ERROR', $request['invoiceId']);
		} catch (InvalidArgumentException $ie) {
			return self::buildResponse(self::ACTION_PAYMENT_AVISO, 100, 'WRONG SUM', $request['invoiceId']);
		} catch (Exception $e) {
			return self::buildResponse(self::ACTION_PAYMENT_AVISO, 100, $e->getMessage(), $request['invoiceId']);
		}

	}


}