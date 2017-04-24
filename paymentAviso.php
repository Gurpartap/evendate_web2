<?php
header('Content-Type: application/xml');
file_put_contents('PayMentInfo.txt', var_export($_REQUEST, true));
$date = new DateTime();


$performedDatetime = $date->format("Y-m-d") . "T" . $date->format("H:i:s") . ".000" . $date->format("P");
echo '<?xml version = "1.0" encoding = "UTF-8"?> 
				<paymentAvisoResponse performedDatetime="' . $performedDatetime . '" code="0" invoiceId="' . $_REQUEST['invoiceId'] . '" 
				shopId="132896"/>';