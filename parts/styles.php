<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=01feabcd912d2c75bf7978b2298fc88b">
	<link rel="stylesheet" href="/dist/app.css?rev=c1003aa47838ced2727a0fcef8cf4faa"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=d40524d997c556958613585e05f65cc9">
	<link rel="stylesheet" href="/dist/app.min.css?rev=c1c31c194edb1753340b12e7060f29bf"><?php
} ?>