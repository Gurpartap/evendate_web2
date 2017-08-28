<html>
<head>
  <title>Перенаправление на страницу оплаты</title>
  <link href="/app/css/loader.css" rel="stylesheet">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0;">
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
  <div class="mask-loading">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <div id="progress-text"
         style="color: rgb(0, 0, 0); width: 100%; position: absolute; top: calc(50% + 55px); margin-top: -25px; text-align: center;">
      Идет перенаправление на страницу оплаты... <br>
      Нажмите кнопку, если не произошло автоматическое перенаправление <br>
    </div>
  </div>
  <button style="
    vertical-align: bottom;
    height: 30px;
    min-width: 30px;
    font-family: inherit;
    font-size: .81em;
    font-weight: 500;
    border: 0;
    border-radius: 2px;
    text-align: center;
    text-transform: uppercase;
    overflow: hidden;
    cursor: pointer;
    word-wrap: normal;
    z-index: 1;
    -webkit-transition: box-shadow .3s ease,background-color .3s ease,color .3s ease,opacity .3s ease;
    transition: box-shadow .3s ease,background-color .3s ease,color .3s ease,opacity .3s ease;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    padding: 0 1rem; display: block;
    width: 200px;
    margin: 0 auto 18px;
    background-color: #00dc88;
    color: #fff;
    line-height: 30px;"> Перейти к оплате
  </button>
</form>
<script>
//    document.getElementById('payment').submit();
</script>
</body>
</html>