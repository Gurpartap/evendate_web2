<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=01feabcd912d2c75bf7978b2298fc88b">
	<link rel="stylesheet" href="/dist/app.css?rev=8edadfdaae6f2c8f6ef5776120eb7f1c"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=062385092d9e8d80ffb46e75c6944622">
	<link rel="stylesheet" href="/dist/app.min.css?rev=56771a0f29f6a248425559a9241c1ade"><?php
} ?>