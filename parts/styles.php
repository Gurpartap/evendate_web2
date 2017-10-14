<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=ca0ff8792104099096f92d9404673df7"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=65d3503d6a24ad325f3c792506580231">
	<link rel="stylesheet" href="/dist/app.min.css?rev=6320872991ee1f6dc93975334cb7c2f4"><?php
} ?>