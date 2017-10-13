<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=7b5e0108efc48f277dbb8737eb6a3be0"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=8eee378d51e4264aebe97d3b5a21f27c">
	<link rel="stylesheet" href="/dist/app.min.css?rev=5aef14baca8145247552d05bdc585832"><?php
} ?>