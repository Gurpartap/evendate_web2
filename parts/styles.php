<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=879135c0eeeb480171f0e922acbdafeb">
	<link rel="stylesheet" href="/dist/app.css?rev=d9285476247dc8b0e60e7ce1849d67b5"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=6fa9ce023db2b506349e91a02f76f0b3">
	<link rel="stylesheet" href="/dist/app.min.css?rev=aecb449d6ee75de15282fff82dacfdde"><?php
} ?>