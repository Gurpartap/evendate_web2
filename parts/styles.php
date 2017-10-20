<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=9283b5a6d1ef24e01aaee498f756f50e">
	<link rel="stylesheet" href="/dist/app.css?rev=2c9647a36931d2f700479a2a456bc439"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=0ddc0278050a1fba01e19e822d40cbd0">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b531b8fa273032185360e5b3c65845f8"><?php
} ?>