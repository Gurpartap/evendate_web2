<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=abfb600f600f6fa4228c7139badf24b7"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=8eee378d51e4264aebe97d3b5a21f27c">
	<link rel="stylesheet" href="/dist/app.min.css?rev=39e5a65c81ee4289a77e43d49465df8f"><?php
} ?>