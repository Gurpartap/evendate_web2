<link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=cebea49deb64bb31a48e0ee93329b6a1">
	<link rel="stylesheet" href="/dist/app.css?rev=bae854f8095cbd123efd35419ac8a4dc"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=cddf9122f7f5a7af206d58f32ef7f6df">
	<link rel="stylesheet" href="/dist/app.min.css?rev=aa1652ea85f3e7691c8b55de7136175c"><?php
} ?>