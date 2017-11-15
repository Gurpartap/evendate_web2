<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=683ab9c7ad4ff5874fdddd11d18e5255">
	<link rel="stylesheet" href="/dist/app.css?rev=1dc58e09fbce87bd3b044fc55518326d"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=3516d0e8b1c0d20fe226f348298964c1">
	<link rel="stylesheet" href="/dist/app.min.css?rev=f07a89187a02bffb854e567ddaf8536d"><?php
} ?>