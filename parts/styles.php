<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=17f6f8fcf2c4933fa4dbf98ef5997d5a">
	<link rel="stylesheet" href="/dist/app.css?rev=6329248be42a823427626f824546d6dd"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=e1722d86311828f8aa0527c91b365939">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b25201acdef9ee45911d4f2e70ac4811"><?php
} ?>