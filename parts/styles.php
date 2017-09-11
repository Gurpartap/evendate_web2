<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=56ef28a55917db09c141a30a451d5db1">
	<link rel="stylesheet" href="/dist/app.css?rev=02213ca6694cf6af43cd6980da4b9881"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=b91038f94123db2da8b39d4c39551412">
	<link rel="stylesheet" href="/dist/app.min.css?rev=cda78d7a5c2c065801428c92d4cee05f"><?php
} ?>