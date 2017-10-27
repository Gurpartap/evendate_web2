<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=604be9dbdf1c3cd1ddf7cf33749df801"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=b7064e492af1f5f42d755568a8a77e77">
	<link rel="stylesheet" href="/dist/app.min.css?rev=791a5a3f98390002730dc60c079e508d"><?php
} ?>