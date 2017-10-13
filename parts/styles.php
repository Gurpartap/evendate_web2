<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a995609783ea62a5dc4d8873afb9aca9">
	<link rel="stylesheet" href="/dist/app.css?rev=1225c01b4e55ae7c0ffd16a32dd4df41"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=8eee378d51e4264aebe97d3b5a21f27c">
	<link rel="stylesheet" href="/dist/app.min.css?rev=7f36081bd69546384fff07ecfc057d36"><?php
} ?>