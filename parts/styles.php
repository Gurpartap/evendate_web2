<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=56ef28a55917db09c141a30a451d5db1">
	<link rel="stylesheet" href="/dist/app.css?rev=32c1fe587ddfa3dfd242860390ddf92b"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=b91038f94123db2da8b39d4c39551412">
	<link rel="stylesheet" href="/dist/app.min.css?rev=229afcb29ad507125a7853ec919c9d27"><?php
} ?>