<html>
<head>
  <title>Перенаправление на страницу оплаты</title>
	<style type="text/css">
		<?php
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/vars.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/common.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/typography.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/components/button.css');
		require_once($_SERVER['DOCUMENT_ROOT'] . '/app/src/css/components/loader.css');
		?>
	</style>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<form id='payment' action='https://money.yandex.ru/eshop.xml' method='post'>
  <input name='shopId' value='132896' type='hidden'>
  <input name='scid' value='97111' type='hidden'>
  <input name='customerNumber' value='<?= $__user->getFirstName() . ' ' . $__user->getLastName() ?>' type='hidden'>
  <input name='cps_email' value='<?= $__user->getEmail() ?>' type='hidden'>
  <input name='shopFailURL' value='<?= $__request['payload']['callback_url'] ?>' type='hidden'>
  <input name='shopSuccessURL' value='<?= $__request['payload']['callback_url'] ?>' type='hidden'>
  <input name='shopDefaultUrl' value='<?= $__request['payload']['callback_url'] ?>' type='hidden'>
  <input name='evendate_payment_id' value='order-<?= $result->getData()['order']['uuid'] ?>' type='hidden'>
  <input name='sum' value='<?= $result->getData()['order']['final_sum'] ?>' type='hidden'>

	<div style="height: 100%; display: flex; align-items: center; justify-content: center">
		<div class="loader_wrapper -align_center">
			<div class="loader_block">
				<div class="loader">
					<div class="loader_dot"></div>
					<div class="loader_dot"></div>
				</div>
			</div>
			<p id="progress-text">
				Идет перенаправление на страницу оплаты... <br>
				Нажмите кнопку, если не произошло автоматическое перенаправление <br>
			</p>
			<button class="button -color_accent">Перейти к оплате</button>
		</div>
	</div>
</form>
<script>
	document.getElementById('payment').submit();
</script>
</body>
</html>