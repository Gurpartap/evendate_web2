<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=af705e27c5d191d55a5793fec7caaedc">
	<link rel="stylesheet" href="/dist/app.css?rev=71ccb05a56949063b65f1f82afb18e5f"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=1f722b22209414230ed327957df71eb7">
	<link rel="stylesheet" href="/dist/app.min.css?rev=a091f2a98e4f2659e019ed4b42c3a0fa"><?php
} ?>