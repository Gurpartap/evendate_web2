<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=f76ebe8c30b7288a0fe8ee16cee52b76">
	<link rel="stylesheet" href="/dist/app.css?rev=8edadfdaae6f2c8f6ef5776120eb7f1c"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=a4da2279742fa5598d47757f6d749a94">
	<link rel="stylesheet" href="/dist/app.min.css?rev=56771a0f29f6a248425559a9241c1ade"><?php
} ?>