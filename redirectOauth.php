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

		try {
			redirect_to = window.localStorage.getItem('redirect_to');
			window.localStorage.removeItem('redirect_to');
		} catch (e) {}

		if (redirect_to) {
			params.push('redirect_to=' + redirect_to);
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