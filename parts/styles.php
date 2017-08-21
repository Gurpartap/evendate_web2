<link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=6d4da3ef58f1872e9f8994faba56a5bc">
	<link rel="stylesheet" href="/dist/app.css?rev=48e0f995c08c520bc1180c1219559c03"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=cddf9122f7f5a7af206d58f32ef7f6df">
	<link rel="stylesheet" href="/dist/app.min.css?rev=aa1652ea85f3e7691c8b55de7136175c"><?php
} ?>