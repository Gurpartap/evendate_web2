<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=0b3234c47f1d4d9ce9e75e2558a09a79"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=8eee378d51e4264aebe97d3b5a21f27c">
	<link rel="stylesheet" href="/dist/app.min.css?rev=b66d6ada60327f1e6229a55518c15213"><?php
} ?>