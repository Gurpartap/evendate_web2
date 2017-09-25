<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=879135c0eeeb480171f0e922acbdafeb">
	<link rel="stylesheet" href="/dist/app.css?rev=09bfaaf4f4c7ac5e691f873766b03057"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=6fa9ce023db2b506349e91a02f76f0b3">
	<link rel="stylesheet" href="/dist/app.min.css?rev=09c0989483a01c941845b7f9aba5eaa5"><?php
} ?>