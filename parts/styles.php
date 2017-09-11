<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=cebea49deb64bb31a48e0ee93329b6a1">
	<link rel="stylesheet" href="/dist/app.css?rev=51f07fc1f25921e9919309f50cc79b50"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=9c264fb062f512252421ced33201a923">
	<link rel="stylesheet" href="/dist/app.min.css?rev=251ce6372c1853025afdddfa05037979"><?php
} ?>