<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Evendate - Авторизация</title>
</head>

<body>

<script type="text/javascript">
	<?php
	require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/vendor/jquery/jquery.js');
	require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/js/lib.js');
	?>
</script>

<?php
require_once 'footer.php';
?>
<script>
	$(document).ready(function () {
		var data = Object.assign(searchToObject(), hashToObject()),
			link = '/oAuthDone.php?' + objectToQueryString(data);

		if (data.mobile === 'true') {
			window.location.href = link;
		} else {
			try {
				window.opener.location.href = link;
			} catch (e) {
				window.opener.postMessage(JSON.stringify({
					command: 'redirect',
					data: link
				}), '*');
			}
			window.close();
		}
	});
</script>