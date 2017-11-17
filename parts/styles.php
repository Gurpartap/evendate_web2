<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
<?php
if ($DEBUG_MODE) { ?>
	<link rel="stylesheet" href="/dist/vendor.css?rev=a063dadb46237a11b71785a55b56200e">
	<link rel="stylesheet" href="/dist/app.css?rev=5a6decd932c9410b2700e6da23cc6df2"><?php
} else { ?>
	<link rel="stylesheet" href="/dist/vendor.min.css?rev=4309642f32fa44cab4400c4b952dbced">
	<link rel="stylesheet" href="/dist/app.min.css?rev=5cabcb7ad592b31b58a798bdf0f6c810"><?php
} ?>