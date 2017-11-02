<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a063dadb46237a11b71785a55b56200e">
	<link rel="stylesheet" href="/dist/app.css?rev=71ccb05a56949063b65f1f82afb18e5f"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=4309642f32fa44cab4400c4b952dbced">
	<link rel="stylesheet" href="/dist/app.min.css?rev=a091f2a98e4f2659e019ed4b42c3a0fa"><?php
} ?>