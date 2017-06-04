<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evendate</title>
  <link href="app/css/loader.css" rel="stylesheet">

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
<body style="margin: 0;">
<div class="mask-loading">
  <div class="spinner">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
  </div>
  <div id="progress-text"
       style="color: rgb(0, 0, 0); width: 100%; position: absolute; top: calc(50% + 55px); margin-top: -25px; text-align: center;">
    Загрузка данных...
  </div>
</div>
<script src="/vendor/jquery/dist/jquery.js" type="text/javascript"></script>

</body>
<?php
require_once('footer.php');
?>
<script>
    var texts_array = [
            'Ожидание ответа от сервера в городе Гринбоу, штат Алабама...',
            'Считаем количество конфет в коробке ...',
            'Считаем количество пингвинов в Арктике ...',
            'Считаем количество зябликов в Зимбабве ...',
            'Вычисляем количество произведенных в восточном Парагвае кирпичей ...',
            'Считаем количество антарктических утконосов в Австралии ...',
            'Вычисляем как сильно влияет размножение зябликов на экономику Зимбабве ...',
            'Вычислили, что точно также, как и производство кирпичей в восточном Парагвае на популяцию антарктического утконоса ...',
            'Получаем ваши личные данные ...',
            'Осталось совсем чуть чуть ...'
        ],
        $pr_text = $('#progress-text').css('color', '#003471'),
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
        }, 3000);
		<?php
		try {
			require_once 'v1-backend/bin/env_variables.php';
			require_once 'v1-backend/bin/db.php';
			App::buildGlobal($__db);
			require_once("{$BACKEND_FULL_PATH}/auth/Class.AuthHandler.php");
			$auth_handler = new AuthHandler($_REQUEST);
			$new_user = $auth_handler->startAuth();
			echo 'var user_data = ' . json_encode(array(
					'token' => $auth_handler->getProvider()->getUserToken(),
					'email' => $auth_handler->getProvider()->getOauthData()['email'],
					'user_id' => $auth_handler->getUserId()
				)) . ';';
		} catch (Exception $e) {
			echo "window.location.reload();";
		}
		?>
  if (user_data){
      $.ajax({
          url: 'auth.php',
          data: user_data,
          success: function(res){
              debugger;
              window.location.href = '/';
          }
      })
  }
</script>