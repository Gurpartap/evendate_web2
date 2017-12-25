<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=dce8d7c7f9c473b00e8e1168c9dd22cf">
	<link rel="stylesheet" href="/dist/app.css?rev=6329248be42a823427626f824546d6dd"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=ae927e0e6516510f6f0f31854a8850fa">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b25201acdef9ee45911d4f2e70ac4811"><?php
} ?>