<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a063dadb46237a11b71785a55b56200e">
	<link rel="stylesheet" href="/dist/app.css?rev=1c472b3face74662bdcc1a1c6b641faa"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=4309642f32fa44cab4400c4b952dbced">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b8c123ac8ad24d68a3b27a3fac9dcd76"><?php
} ?>