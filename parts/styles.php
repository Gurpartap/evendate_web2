<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=01feabcd912d2c75bf7978b2298fc88b">
	<link rel="stylesheet" href="/dist/app.css?rev=868a0d7ef4b1ea38d002c439a2a8c474"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=062385092d9e8d80ffb46e75c6944622">
	<link rel="stylesheet" href="/dist/app.min.css?rev=c5cdb68dbdc91f65e874325391d4c82f"><?php
} ?>