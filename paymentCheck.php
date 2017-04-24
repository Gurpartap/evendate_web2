<?php

require_once $BACKEND_FULL_PATH . '/bin/db.php';
require_once $BACKEND_FULL_PATH . '/bin/app_config.php';

App::buildGlobal($__db);
$act = explode('/', $_REQUEST['_url']);
$_url = $_REQUEST['_url'];
$_class_name = $act[1];
$_method_name = isset($act[2]) ? $act[2] : '';
$_args = array();

if (count($act) > 3) {
	for ($i = 3; $i < count($act); $i++) {
		$_args[] = $act[$i];
	}
}


header('Content-Type: application/xml');
$date = new DateTime();
$request = $_REQUEST;

$str = $request['action'] . ";" .
	$request['orderSumAmount'] . ";" . $request['orderSumCurrencyPaycash'] . ";" .
	$request['orderSumBankPaycash'] . ";" . $request['shopId'] . ";" .
	$request['invoiceId'] . ";" . trim($request['customerNumber']) . ";" . 'Kaz!uistika31415!926';

$md5 = strtoupper(md5($str));
$performedDatetime = $date->format("Y-m-d") . "T" . $date->format("H:i:s") . ".000" . $date->format("P");

try {
	if ($md5 != strtoupper($request['md5'])) throw new InvalidArgumentException("Wait for md5:" . $md5 . ", recieved md5: " . $request['md5']);

	echo '<?xml version = "1.0" encoding = "UTF-8"?> 
				<checkOrderResponse performedDatetime="' . $performedDatetime . '" code="0" invoiceId="' . $_REQUEST['invoiceId'] . '" 
				shopId="132896"/>';
	App::logRequest($__db, App::$__REQUEST, null, $_SERVER['REQUEST_METHOD'], 'kassa-payments',
		$_args, $_method_name, App::$__HEADERS, 200, new DateTime(), null, null);
} catch (Exception $e) {
	echo '<?xml version = "1.0" encoding = "UTF-8"?> 
				<checkOrderResponse performedDatetime="' . $performedDatetime . '" code="0" invoiceId="' . $_REQUEST['invoiceId'] . '" 
				shopId="132896"/>';
}

