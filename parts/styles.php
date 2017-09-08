<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=01feabcd912d2c75bf7978b2298fc88b">
	<link rel="stylesheet" href="/dist/app.css?rev=4f21215ffc29aa8da1720b99896d0d8f"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=062385092d9e8d80ffb46e75c6944622">
	<link rel="stylesheet" href="/dist/app.min.css?rev=0fa9d37bfe9d7ed05fe3438067689cff"><?php
} ?>