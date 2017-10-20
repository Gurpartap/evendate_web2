<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a93186c7ed5703bfd44f6008248a8ddf">
	<link rel="stylesheet" href="/dist/app.css?rev=f02a80330049c7831ff109bac4198017"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=51b229d9eddd24339f3de39bbceae297">
	<link rel="stylesheet" href="/dist/app.min.css?rev=71cbbc8700e90a97c9d5a94cb20eeaf5"><?php
} ?>