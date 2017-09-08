<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=6d4da3ef58f1872e9f8994faba56a5bc">
	<link rel="stylesheet" href="/dist/app.css?rev=8e9488797a812aaa15ca046788733b98"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=cddf9122f7f5a7af206d58f32ef7f6df">
	<link rel="stylesheet" href="/dist/app.min.css?rev=276c7dffaa5534da26c4b3f76b7e1d23"><?php
} ?>