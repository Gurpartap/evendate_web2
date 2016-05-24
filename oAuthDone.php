<?php
require_once 'v1-backend/bin/db.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="google-signin-client_id" content="403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com">
    <title>Evendate - Авторизация</title>
    <!-- =============== VENDOR STYLES ===============-->
    <!-- FONT AWESOME-->
    <link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
    <!-- =============== BOOTSTRAP STYLES ===============-->
    <link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
    <!-- =============== APP STYLES ===============-->
    <link rel="stylesheet" href="app/css/app.css" id="maincss">

</head>

<body>
<div class="wrapper">
    <div class="block-center mt-xl wd-xl">
        <!-- START panel-->

        <div class="panel panel-default">
            <div class="panel-heading">Загрузка данных</div>
            <div class="panel-body loader-demo">
                <div class="spinner" style="display: none;">
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                </div>
            </div>
        </div>

        <div class="panel panel-danger hidden">
            <div class="panel-heading">Ошибка авторизации - отсутствует Email</div>
            <div class="panel-body">
                В Вашем аккаунте vk.com не указан email. Авторизация невозможна.
                Укажите, пожалуйста, в Вашем аккаунте
                <a href="https://vk.com/settings#chgmail" target="_blank">https://vk.com/settings</a> email и попробуйте еще раз.
            </div>
        </div>


        <!-- END panel-->
        <div class="p-lg text-center">
            <span>&copy;</span>
            <span>2016</span>
            <span>-</span>
            <span>Evendate</span>
        </div>
    </div>
</div>
<!-- =============== VENDOR SCRIPTS ===============-->
<!-- MODERNIZR-->
<script src="vendor/modernizr/modernizr.js"></script>
<!-- JQUERY-->
<script src="vendor/jquery/dist/jquery.js"></script>
<!-- BOOTSTRAP-->
<script src="vendor/bootstrap/dist/js/bootstrap.js"></script>
<!-- VK OPEN API FOR AUTHORIZATION-->
<script src="<?=App::$SCHEMA . App::$NODE_DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>

<?php
    require_once 'footer.php';
?>
<!-- =============== APP SCRIPTS ===============-->
<script src="app/js/app.js"></script>

<script>
    $(document).ready(function(){
        console.log('log is here');
        window.resizeTo(530, 400);
        var mobile_data = searchToObject(),
            data = $.extend(mobile_data, hashToObject(), true);
        socket.emit('auth.oauthDone', data);
        socket.on('vk.needEmail', function(){
            $('.panel').toggleClass('hidden');
        });
    });
</script>