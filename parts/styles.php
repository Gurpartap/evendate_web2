<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=5e2bdbc99adf535580ab14333084857d">
	<link rel="stylesheet" href="/dist/app.css?rev=08d284d9ba4722f77ff482cb90b1efbf"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=3d7dfdb144d00f4e0db655e4b2f1be0d">
	<link rel="stylesheet" href="/dist/app.min.css?rev=bb741fe7801e2ab6ed4db3947e478812"><?php
} ?>