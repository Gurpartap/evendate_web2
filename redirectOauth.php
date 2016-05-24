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
        var data = $.extend(searchToObject(), hashToObject(), true);
        var link = '/oAuthDone.php?',
            params = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                params.push(key + '=' + data[key]);
            }
        }
        window.opener.location.href = link + params.join('&');
        window.close();
    });


</script>