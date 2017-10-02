<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=92497e697bbaea2a06cd3989d241f609"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=65d3503d6a24ad325f3c792506580231">
	<link rel="stylesheet" href="/dist/app.min.css?rev=ada87e359b5e286fc0af8d5796a446b9"><?php
} ?>