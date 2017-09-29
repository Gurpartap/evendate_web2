<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a93186c7ed5703bfd44f6008248a8ddf">
	<link rel="stylesheet" href="/dist/app.css?rev=167d9fc9e6da9f041df4bd445562086f"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=51b229d9eddd24339f3de39bbceae297">
	<link rel="stylesheet" href="/dist/app.min.css?rev=8c3d7b6b0bbee4efa054d97024dc9287"><?php
} ?>