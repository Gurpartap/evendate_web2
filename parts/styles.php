<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=6f760b29e2cef8c021e02dc28805f413"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=22242f46d1b93c50cf0703e80cb7b961">
	<link rel="stylesheet" href="/dist/app.min.css?rev=85633d0a163ed781232e1a9d127e314f"><?php
} ?>