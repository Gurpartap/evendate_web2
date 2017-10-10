<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=08d284d9ba4722f77ff482cb90b1efbf"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=8eee378d51e4264aebe97d3b5a21f27c">
	<link rel="stylesheet" href="/dist/app.min.css?rev=bb741fe7801e2ab6ed4db3947e478812"><?php
} ?>