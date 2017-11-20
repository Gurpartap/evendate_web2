<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a063dadb46237a11b71785a55b56200e">
	<link rel="stylesheet" href="/dist/app.css?rev=9d439d1a0619facc7a003f23882910dd"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=4309642f32fa44cab4400c4b952dbced">
	<link rel="stylesheet" href="/dist/app.min.css?rev=6e424cd2068905b988d9575465b22997"><?php
} ?>