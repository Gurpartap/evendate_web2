<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=879135c0eeeb480171f0e922acbdafeb">
	<link rel="stylesheet" href="/dist/app.css?rev=5ddbfd3dd45227efded4bd43d0032dde"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=b7064e492af1f5f42d755568a8a77e77">
	<link rel="stylesheet" href="/dist/app.min.css?rev=791a5a3f98390002730dc60c079e508d"><?php
} ?>