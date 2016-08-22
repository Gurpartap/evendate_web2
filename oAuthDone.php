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
    <link rel="icon" type="image/png" sizes="192x192"  href="/app/img/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/app/img/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/app/img/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/app/img/favicon/favicon-16x16.png">
    <link rel="manifest" href="/app/img/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/app/img/favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

</head>
<body>
<div class="mask-loading">
    <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>
<script src="/vendor/jquery/dist/jquery.js" type="text/javascript"></script>
<script src="/app/js/app.js"></script>

</body>
<?php
    require_once('footer.php');
?>
<script>
    $(document).ready(function () {
        var data = $.extend(searchToObject(), hashToObject(), true);
        socket.emit('auth.oauthDone', data);
        socket.on('vk.needEmail', function () {
            $('.panel').toggleClass('hidden');
        });
    });
</script>