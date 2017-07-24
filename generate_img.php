<?php

require_once './v1-backend/bin/env_variables.php';
require_once "{$BACKEND_FULL_PATH}/bin/db.php";

$sess_id = session_id();

if (isset($_FILES['image']['tmp_name'])) {
	$extention = (end(explode('.', $_FILES['image']['name'])));
	move_uploaded_file($_FILES['image']['tmp_name'], '/var/www/html/tickets_images/upl-image ' . $sess_id . '.' . $extention);
	$filename = './tickets_images/upl-image ' . $sess_id . '.' . $extention;
} else {
	$filename = './tickets_images/image.png';
}

$src1 = new \Imagick($filename);
$src2 = new \Imagick('./tickets_images/template.png');
//$src2->readImageFile($bottom_file);

$image_info = $src1->getImageGeometry();
$tmpl_info = $src2->getImageGeometry();
if ($image_info['width'] > $tmpl_info['width']) {
	$src1->scaleImage($tmpl_info['width'], 0);
	$image_info = $src1->getImageGeometry();
} else {
	$src2->scaleImage($image_info['width'], 0);
	$tmpl_info = $src2->getImageGeometry();
}
$src1->setImageExtent($image_info['width'], $image_info['height'] + $tmpl_info['height'] - 20);
$src1->compositeImage($src2, Imagick::COMPOSITE_DEFAULT, 0, $image_info['height'] - 20);

//$src1->resetIterator();
//$combined = $src1->appendImages(true);
$path = "./tickets_images/{$sess_id}.png";

$src1->setImageFormat("png");

$src1->writeImage($path);

/* destroy imagick objects */

if (isset($_REQUEST['show_form'])) {
	echo '
<form action="generate_img.php" name="send-form" method="post" enctype="multipart/form-data">
  <input type="file" name="image">
  <input type="hidden" value="show">
  <input type="text" name="show_form" value="' . (isset($_REQUEST['show_form']) ? 'true' : 'false') . '">
  <button type="submit">Отправить</button>
  <img src="./tickets_images/' . $sess_id . '.png">
</form>';
} else {
	header('Content-type: image/png');
	if (isset($_REQUEST['download']) && $_REQUEST['download'] == true) {
		header('Content-Disposition: download; filename="' . $path . '"');
	}
	readfile($path);
}
