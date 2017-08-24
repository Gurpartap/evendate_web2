<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=6d4da3ef58f1872e9f8994faba56a5bc">
	<link rel="stylesheet" href="/dist/app.css?rev=32c1fe587ddfa3dfd242860390ddf92b"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=cddf9122f7f5a7af206d58f32ef7f6df">
	<link rel="stylesheet" href="/dist/app.min.css?rev=229afcb29ad507125a7853ec919c9d27"><?php
} ?>