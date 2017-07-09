<?php

require_once $BACKEND_FULL_PATH . '/payments/Class.Payment.php';

$__modules['payments'] = array(
//	'GET' => array(),
	'POST' => array(
		'organizations' => function () use ($__db, $__request, $__user) {
			if (!isset($__request['organization_id'])) throw new InvalidArgumentException('CANT_FIND_ORGANIZATION');
			return Payment::createForOrganization(
				OrganizationsCollection::one($__db, $__user, $__request['organization_id'], array(), array()),
				$__user,
				$__db,
				$__request
			);
		},
		// is using by yandex.kassa
		'check' => function () use ($__db, $__request) {
			if (isset($__request['evendate_payment_id']) && strstr($__request['evendate_payment_id'], 'order-')) {
				$result = new Result(true, '', array(), 0, 'xml');
				$data = Order::checkPayment($__request, $__db);
				$result->setNudeData($data);
				App::$RESPONSE_FORMAT = 'xml';
				App::$RESPONSE_NUDE = true;
				@file_get_contents(App::DEFAULT_NODE_LOCATION . '/log?data=' . $data);
				return $result;
			} else {
				$result = new Result(true, '', array(), 0, 'xml');
				$data = Payment::checkPayment($__request, $__db);
				$result->setNudeData($data);
				App::$RESPONSE_FORMAT = 'xml';
				App::$RESPONSE_NUDE = true;
				@file_get_contents(App::DEFAULT_NODE_LOCATION . '/log?data=' . $data);
				return $result;
			}
		},
		// is using by yandex.kassa
		'aviso' => function () use ($__db, $__request) {
			if (isset($__request['evendate_payment_id']) && strstr($__request['evendate_payment_id'], 'order-')) {
				$result = new Result(true, '', array(), 0, 'xml');
				$data = Order::avisoPayment($__request, $__db);
				$result->setNudeData($data);
				App::$RESPONSE_FORMAT = 'xml';
				App::$RESPONSE_NUDE = true;
				@file_get_contents(App::DEFAULT_NODE_LOCATION . '/log?data=' . $data);
				return $result;
			} else {
				$result = new Result(true, '', array(), 0, 'xml');
				$data = Payment::avisoPayment($__request, $__db);
				$result->setNudeData($data);
				App::$RESPONSE_FORMAT = 'xml';
				App::$RESPONSE_NUDE = true;
				@file_get_contents(App::DEFAULT_NODE_LOCATION . '/log?data=' . $data);
				return $result;
			}
		}
	),
	'PUT' => array()
);