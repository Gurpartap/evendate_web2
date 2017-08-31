<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Evendate - Авторизация</title>
    <!-- =============== VENDOR STYLES ===============-->
</head>

<body>

<script src="/vendor/jquery/dist/jquery.js" type="text/javascript"></script>
<script src="/app/js/app.js" type="text/javascript"></script>

<?php
require_once 'footer.php';
?>
<script>
	$(document).ready(function () {
		var data = $.extend(searchToObject(), hashToObject(), true),
			params = [],
			link,
			redirect_to;

		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				params.push(key + '=' + data[key]);
			}
		}

		link = '/oAuthDone.php?' + params.join('&');

		if (data.mobile == 'true') {
			window.location.href = link;
		} else {
			try {
				window.opener.location.href = link;
			} catch (e) {
				window.opener.postMessage(JSON.stringify({
					command: 'authDone',
					data: link
				}), '*');
			}
			window.close();
		}
	});


</script>