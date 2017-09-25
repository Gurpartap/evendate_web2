<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a93186c7ed5703bfd44f6008248a8ddf">
	<link rel="stylesheet" href="/dist/app.css?rev=210eb378a451264547a6799276486f60"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=51b229d9eddd24339f3de39bbceae297">
	<link rel="stylesheet" href="/dist/app.min.css?rev=155c49605f59dc8201f14c3dde7386a6"><?php
} ?>