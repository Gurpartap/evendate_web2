<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=cebea49deb64bb31a48e0ee93329b6a1">
	<link rel="stylesheet" href="/dist/app.css?rev=32c1fe587ddfa3dfd242860390ddf92b"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=1cfa7515d3fd45a45f7251e70192afa4">
	<link rel="stylesheet" href="/dist/app.min.css?rev=229afcb29ad507125a7853ec919c9d27"><?php
} ?>