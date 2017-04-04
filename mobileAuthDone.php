<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Evendate - Авторизация прошла успешно</title>
    <link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
    <link rel="stylesheet" href="app/css/app.css" id="maincss">

</head>

<body>
<div class="wrapper">
    <div class="block-center mt-xl wd-xl">
        <!-- START panel-->
        <div class="panel panel-default">
            <div class="panel-heading">Авторизация прошла успешно!</div>
        </div>

        <!-- END panel-->
        <div class="p-lg text-center">
            <span>&copy;</span>
            <span>2017</span>
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

<!-- =============== APP SCRIPTS ===============-->
<script src="app/js/app.js"></script>
<script>
  if (window.opener){
      var __data = searchToObject();
      window.opener.localStorage.setItem('token', window.__data.token);
      window.opener.location.reload();
      window.close();
  }
</script>
</body>
</html>