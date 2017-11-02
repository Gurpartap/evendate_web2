<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=15baece4e1d2fae4ca0905d84e2ed9fd">
	<link rel="stylesheet" href="/dist/app.css?rev=0fa100fc47610be2e08973550ad015fd"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=22a5bc63eb638b9b3076dd31cbb6f771">
	<link rel="stylesheet" href="/dist/app.min.css?rev=9798bd24dbfc02878e8ca7ca997a3d31"><?php
} ?>