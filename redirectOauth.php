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
				// IS WIDGET
				function goToOAuthDone(event) {
					var data;

					if (event.origin.indexOf('evendate') !== -1) {
						data = JSON.parse(event.data);

						switch (data.command) {
							case 'redirect': {

								return window.location = data.data;
							}
						}

						if (data.command === 'passRedirectToParam') {
							link += '&redirect_to=' + data.data;

							window.opener.postMessage(JSON.stringify({
								command: 'redirect',
								data: link
							}), '*');
						}
					}

					return null;
				}

				if (window.addEventListener) {
					window.addEventListener('message', goToOAuthDone);
				} else {
					window.attachEvent('onmessage', goToOAuthDone);
				}

				window.opener.postMessage(JSON.stringify({
					command: 'fetchRedirectToParam',
					data: null
				}), '*');
			}
			window.close();
		}
	});
</script>