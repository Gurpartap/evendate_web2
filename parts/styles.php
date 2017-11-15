<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=690a287075d39e59f770d4d45a139083">
	<link rel="stylesheet" href="/dist/app.css?rev=06d24119da8242b944f4fc6f64d593cc"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=2d801e3a120946cd170e4ef474917ee1">
	<link rel="stylesheet" href="/dist/app.min.css?rev=a091f2a98e4f2659e019ed4b42c3a0fa"><?php
} ?>