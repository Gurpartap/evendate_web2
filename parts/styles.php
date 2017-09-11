<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=cebea49deb64bb31a48e0ee93329b6a1">
	<link rel="stylesheet" href="/dist/app.css?rev=868a0d7ef4b1ea38d002c439a2a8c474"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=d40524d997c556958613585e05f65cc9">
	<link rel="stylesheet" href="/dist/app.min.css?rev=c5cdb68dbdc91f65e874325391d4c82f"><?php
} ?>