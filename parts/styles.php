<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=683ab9c7ad4ff5874fdddd11d18e5255">
	<link rel="stylesheet" href="/dist/app.css?rev=df01d9a79bc5ee967da7286b72f819ba"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=3516d0e8b1c0d20fe226f348298964c1">
	<link rel="stylesheet" href="/dist/app.min.css?rev=13886cd873b3677ff83a9e2ef3a9e559"><?php
} ?>