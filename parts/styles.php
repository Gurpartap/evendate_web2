<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=cebea49deb64bb31a48e0ee93329b6a1">
	<link rel="stylesheet" href="/dist/app.css?rev=ef801658c9b5df7585e5c1e0f8e97e72"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=d40524d997c556958613585e05f65cc9">
	<link rel="stylesheet" href="/dist/app.min.css?rev=022ee7b4f7aee5c148aa08fd3992c75f"><?php
} ?>