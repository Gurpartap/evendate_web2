<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=354c08d66c4ec1ba5913be1de5b65ec1">
	<link rel="stylesheet" href="/dist/app.css?rev=6329248be42a823427626f824546d6dd"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=6dbc1d6ce1121256db232b45f86601a1">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b25201acdef9ee45911d4f2e70ac4811"><?php
} ?>