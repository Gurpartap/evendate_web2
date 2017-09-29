<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a93186c7ed5703bfd44f6008248a8ddf">
	<link rel="stylesheet" href="/dist/app.css?rev=c6e7aeee955657d482354f1a41c1d2f4"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=51b229d9eddd24339f3de39bbceae297">
	<link rel="stylesheet" href="/dist/app.min.css?rev=2030c6537b4ddb63df2e18518e1f93e1"><?php
} ?>