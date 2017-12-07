<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=46638befd2ddb22df055cf6ad035a319">
	<link rel="stylesheet" href="/dist/app.css?rev=1c472b3face74662bdcc1a1c6b641faa"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=92ce7426f0bf5bc65bde15563664dd3e">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b8c123ac8ad24d68a3b27a3fac9dcd76"><?php
} ?>