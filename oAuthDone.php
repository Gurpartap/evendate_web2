<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evendate</title>
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

  <link rel="apple-touch-icon" sizes="57x57" href="/app/img/favicon/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/app/img/favicon/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/app/img/favicon/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/app/img/favicon/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/app/img/favicon/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/app/img/favicon/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/app/img/favicon/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/app/img/favicon/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/app/img/favicon/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/app/img/favicon/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/app/img/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/app/img/favicon/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/app/img/favicon/favicon-16x16.png">
  <link rel="manifest" href="manifest.json">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="/app/img/favicon/ms-icon-144x144.png">
  <meta name="theme-color" content="#ffffff">

</head>
<body>

<div style="height: 100%; display: flex; align-items: center; justify-content: center">
	<div class="loader_wrapper -align_center">
		<div class="loader_block">
			<div class="loader">
				<div class="loader_dot"></div>
				<div class="loader_dot"></div>
			</div>
		</div>
		<p id="progress-text">
			Загрузка данных...
		</p>
	</div>
</div>

<script type="text/javascript">
	<?php
	require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/vendor/jquery/jquery.js');
	require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/js/lib.js');
	?>
</script>

</body>
<?php
require_once('footer.php');
?>
<script>
	!function($) {
		var texts_array = [
				'Ожидание ответа от сервера в городе Гринбоу, штат Алабама...',
				'Считаем количество конфет в коробке...',
				'Считаем количество пингвинов в Арктике...',
				'Считаем количество зябликов в Зимбабве...',
				'Вычисляем количество произведенных в восточном Парагвае кирпичей...',
				'Считаем количество антарктических утконосов в Австралии...',
				'Вычисляем как сильно влияет размножение зябликов на экономику Зимбабве...',
				'Вычислили, что точно также, как и производство кирпичей в восточном Парагвае на популяцию антарктического утконоса...',
				'Получаем ваши личные данные...',
				'Осталось совсем чуть чуть...'
			],
			$pr_text = $('#progress-text'),
			text_number = 0,
			first = Math.floor((Math.random() * 40) + 1),
			interval = setInterval(function () {
				var inc = Math.floor((Math.random() * 5) + 1);

				if (first < 90) {
					first = first + inc;
				} else {
					window.clearInterval(interval);
				}
				$pr_text.text(texts_array[text_number++]);
			}, 3000),
			data = Object.assign(searchToObject(), hashToObject());

		$.ajax({
			url: '/api/v1/auth/' + window.location.search,
			success: function (auth_res) {
				if (auth_res.status) {
					if (auth_res.data) {
						$.ajax({
							url: 'auth.php',
							data: auth_res.data,
							success: function (res) {
								window.location.href = (function() {
									var organization_info = null,
										redirect_to = null;

									try {
										organization_info = window.sessionStorage.getItem('organization_info');
										redirect_to = window.sessionStorage.getItem('redirect_after_auth');
										window.sessionStorage.removeItem('redirect_after_auth');

									} catch (e) {}
									if (data.redirect_to || redirect_to) {

										return data.redirect_to || redirect_to;
									} else if (data.mobile === 'true') {

										return '/mobileAuthDone.php?' + objectToQueryString(data);
									} else if (organization_info) {

										return '/add/organization';
									}

									return '/';
								}());
							}
						});
					} else {
						window.location.reload();
					}
				}
			}
		});
	}(jQuery);
</script>