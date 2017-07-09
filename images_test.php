<?php

if (isset($_FILES['image']['tmp_name'])) {
  $extention = (end(explode('.', $_FILES['image']['name'])));
	move_uploaded_file($_FILES['image']['tmp_name'], '/var/www/html/tickets_images/upl-image.' . $extention);
	$filename = './tickets_images/upl-image.' . $extention;
}else{
	$filename = 'image.jpg';
}

$src1 = new \Imagick($filename);
$src2 = new \Imagick('template.png');
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
$path = "./tickets_images/merged_image.png";

$src1->setImageFormat("png");

$src1->writeImage($path);

/* destroy imagick objects */

?>
<form action="images_test.php" name="send-form" method="post" enctype="multipart/form-data">
  <input type="file" name="image">
  <input type="hidden" value="show">
  <button type="submit">Отправить</button>
  <img src="./tickets_images/merged_image.png">
</form>
