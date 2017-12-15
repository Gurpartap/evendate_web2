<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=527bb7e9a53e589fa038d72219586f71">
	<link rel="stylesheet" href="/dist/app.css?rev=6329248be42a823427626f824546d6dd"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=66c32b1c9cbd6b93e874470a245f22da">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b25201acdef9ee45911d4f2e70ac4811"><?php
} ?>