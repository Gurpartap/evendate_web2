<?php

if (!isset($_REQUEST['event_id'])) die();

$folder_name = 'd_' . $_REQUEST['event_id'];

if (!file_exists($folder_name)) {
	mkdir($folder_name);
}

if ($_REQUEST['event_id']) {
	$ext_parts = explode('.', $_FILES['file']['name']);
	$ext = end($ext_parts);
	$checksum = md5_file($_FILES['file']['tmp_name']);
	$filename = $folder_name . '/' . $checksum . '.'. $ext;
	move_uploaded_file($_FILES['file']['tmp_name'], './' . $filename);
	echo '/event_images/landings/' . $filename;
}
