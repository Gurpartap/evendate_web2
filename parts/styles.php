<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=e58b965ff68127d6ebcd7e1d22011208">
	<link rel="stylesheet" href="/dist/app.css?rev=868a0d7ef4b1ea38d002c439a2a8c474"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=c72cfe72e82463811ede85f4288ad803">
	<link rel="stylesheet" href="/dist/app.min.css?rev=c5cdb68dbdc91f65e874325391d4c82f"><?php
} ?>