<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>Evendate - Авторизация прошла успешно</title>
	<style type="text/css">
		html,
		body {height: 100%}
		<?php
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/vars.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/common.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/typography.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/components/button.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/components/loader.css');
		?>
	</style>

</head>

<body>
<div style="height: 100%; display: flex; align-items: center; justify-content: center">
	<p id="progress-text">Авторизация прошла успешно!</p>
</div>
<script type="text/javascript">
	<?php
	require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/vendor/jquery/jquery.js');
	require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/js/lib.js');
	?>
</script>
<script>
  if (window.opener){
      var __data = searchToObject();

      try {
          window.opener.localStorage.setItem('token', window.__data.token);
          window.opener.location.reload();
      } catch (e){
          window.opener.postMessage(JSON.stringify(__data), '*');
      }
      window.close();
  }
</script>
</body>
</html>