<?php
    require_once 'backend/bin/db.php';
    require_once 'backend/bin/Class.Result.php';
    require_once 'backend/users/Class.AbstractUser.php';
    require_once 'backend/users/Class.User.php';
    require_once 'backend/tags/Class.TagsCollection.php';
    try{
        $user = new User($db);
        if (isset($_GET['logout']) && $_GET['logout'] == true){
            $user->logout();
        }else{
            header('Location: /timeline');
            die();
        }
    }catch(Exception $e){}
?>
<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="google-signin-client_id" content="403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com">
   <title>Evendate</title>
   <!-- =============== VENDOR STYLES ===============-->
   <!-- FONT AWESOME-->
   <link rel="stylesheet" href="vendor/fontawesome/css/font-awesome.min.css">
   <!-- SIMPLE LINE ICONS-->
   <link rel="stylesheet" href="vendor/simple-line-icons/css/simple-line-icons.css">
   <!-- =============== BOOTSTRAP STYLES ===============-->
   <link rel="stylesheet" href="app/css/bootstrap.css" id="bscss">
   <!-- =============== APP STYLES ===============-->
   <link rel="stylesheet" href="app/css/app.css" id="maincss">
</head>

<body>
   <div class="wrapper">
      <div class="block-center mt-xl wd-xl">
         <!-- START panel-->
         <div class="panel panel-dark panel-flat">
            <div class="panel-heading text-center">
               <a href="#">
                  <img src="app/img/logo.png" alt="Image" class="block-center img-rounded" style="max-height: 30px;">
               </a>
            </div>
            <div class="panel-body">
              <div>
                <button class="btn btn-primary vk-auth-btn">VK.com</button>
                <button class="btn btn-danger google-plus-btn">Google Plus</button>
                <button class="btn btn-black-blue facebook-btn">Facebook</button>
              </div>
            </div>
         </div>
         <!-- END panel-->
         <div class="p-lg text-center">
            <span>&copy;</span>
            <span>2015</span>
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
   <script src="http://<?=App::$DOMAIN?>:8080/socket.io/socket.io.js" type="text/javascript"></script>
   <script src="app/js/app.js"></script>
   <!-- NOTIFICATIONS API -->
   <script src="vendor/notify/notify.js"></script>


   <script>
       $('.vk-auth-btn,.google-plus-btn,.facebook-btn').on('click', function(){
      if (Notify.needsPermission) {
          Notify.requestPermission(function(){}, function(){
              showNotifier({status: false, text: 'Мы не можем включить уведомления в браузере. Вы запретили их для нас :('});
          });
      }
  });
   </script>

   <?php
    require 'footer.php';
   ?>

</body>

</html>