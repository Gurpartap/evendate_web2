<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=cebea49deb64bb31a48e0ee93329b6a1">
	<link rel="stylesheet" href="/dist/app.css?rev=a7cc645185cb69148273e892966c1232"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=d40524d997c556958613585e05f65cc9">
	<link rel="stylesheet" href="/dist/app.min.css?rev=0601dabaf4c39e40ca50613660425d56"><?php
} ?>