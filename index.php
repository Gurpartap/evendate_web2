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
<!doctype html>
<html lang="en" class="particles">
   <head>
   	
         <meta charset="utf-8" />
  		
         <title>Evendate - наполняй жизнь событиями</title>
         <meta name="description" content="" />
    	
         <!-- Meta Viewport -->
         <meta name="viewport" content="width=device-width, initial-scale=1">
		
         <!-- All CSS Styles -->
         <link type="text/css" href="/app/landing/css/bootstrap.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/animate.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/swiper.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/owl.carousel.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/owl.theme.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/magnific-popup.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/styles/style-blue.css" rel="stylesheet" media="screen" />
         <link type="text/css" href="/app/landing/css/font-awesome.min.css" rel="stylesheet" media="screen" />

         <!-- Media Queries -->
         <link type="text/css" href="/app/landing/css/media.css" rel="stylesheet" media="screen" />
            
         <!-- Modernizr -->
         <script type="text/javascript" src="/app/landing/js/modernizr.js"></script>
		
         <!-- Comments for IE8 and Lower -->				
		
         <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
         <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
         <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
         <![endif]-->     
         
         <!-- Gradient Support IE9 -->
         <!--[if gte IE 9]>
            <style type="text/css">
              .gradient {
                 filter: none;
              }
            </style>
         <![endif]-->	
      
	</head>
	<body class="particles">
	      <!-- Preloader -->
         <div id="loader-wrapper">
             <div id="loader"></div>
         </div>
         <!-- Preloader End -->
			
         <!-- Header -->
         <header>
         
               <!-- Intro -->
               <div id="intro" class="overlay-gradient" data-scroll-index="0">        

                        <!-- Top Bar -->
                        <div class="top-bar">
               
                           <div class="container">
                              <div class="row">
                              
                                 <div class="col-md-12">
                                 
                                       <!-- Logo -->
                                       <div class="logo"><a title="" href="#"><img src="app/img/logo_500.png"> Evendate</a></div>
                                       <!-- Logo End -->
                     
                                       <!-- Menu -->
                                       <div class="nav">
                     
                                          <nav class="navbar navbar-default" role="navigation">
                                          
                                             <!-- Mobile Button -->
		                                       <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                                                <span class="sr-only">Toggle navigation</span>
                                                <span class="icon-bar"></span>
                                                <span class="icon-bar"></span>
                                                <span class="icon-bar"></span>
                                             </button>
                                             <!-- Mobile Button End -->
                                          		               
                                             <ul class="collapse navbar-collapse navbar-ex1-collapse">
                                                <li><a data-scroll-nav="0" title="">В начало</a></li>
                                                <li><a data-scroll-nav="1" title="">Как это работает</a></li>
                                                <li><a data-scroll-nav="2" title="">Организаторам</a></li>
                                                <li><a data-scroll-nav="3" title="">Студентам</a></li>
                                                <li><a data-scroll-nav="4" title="">Цены</a></li>
                                                <li><a data-scroll-nav="5" title="">Контакты</a></li>
                                                <li class="download-btn"><a data-scroll-nav="4" title="">Войти <i class="fa fa-sign-in"></i></a></li>
                                             </ul>                                       
                                          </nav>
                        
                                       </div>
                                       <!-- Menu End -->
                                       
                                 </div>
               
                              </div><!-- .row End -->                  
                           </div><!-- .container End -->
                           
                                             
                        </div>
                        <!-- Top Bar End -->
                        
                        <div class="container">
                           <div class="row">
                              
                                 
                                 <div class="col-md-12">
                                    
                                       <!-- Intro Heading -->
                                       <div class="headline">
                                       
                                          <h1 class="wow fadeInDown">наполняй жизнь событиями</h1>
                                          <p class="wow fadeInDown" data-wow-delay="0.5s">Будь в курсе всех событий, которые проходят в интересных тебе организациях, и узнавай, что интересно твоим друзьям.</p>
                                          
                                       </div>
                                       <!-- Intro Heading End -->
                                       
                                       
                                       <!-- Phone Carousel -->
                                       <div class="swiper-container wow fadeIn" data-wow-delay="1.5s">
                                       
                                          <!-- Arrows -->
                                          <a class="arrow-left" href="#" title=""><i class="fa fa-angle-left"></i></a>
                                          <a class="arrow-right" href="#" title=""><i class="fa fa-angle-right"></i></a>
                                          <!-- Arrows End -->
                                          
                                          <div class="swiper-wrapper">   
                                       
                                             <!-- First Slide -->   
                                             <div class="swiper-slide">
                                                <img class="img-responsive" src="/app/landing/img/bg/phone1.png" alt="">
                                             </div>
                                             
                                             <!-- Second Slide --> 
                                             <div class="swiper-slide">
                                                <img class="img-responsive" src="/app/landing/img/bg/phone2.png" alt="">
                                             </div>
                                             
                                             <!-- Thrid Slide --> 
                                             <div class="swiper-slide">
                                                <img class="img-responsive" src="/app/landing/img/bg/phone3.png" alt="">
                                             </div>
                                             <!-- Thrid Slide -->
                                             <div class="swiper-slide">
                                                <img class="img-responsive" src="/app/landing/img/bg/phone4.png" alt="">
                                             </div>
                                             <!-- Thrid Slide -->
                                             <div class="swiper-slide">
                                                <img class="img-responsive" src="/app/landing/img/bg/phone5.png" alt="">
                                             </div>
                                             <!-- Thrid Slide -->
                                             <div class="swiper-slide">
                                                <img class="img-responsive" src="/app/landing/img/bg/phone6.png" alt="">
                                             </div>
                                       
                                          </div>      
                                       </div>
                                       <!-- Phone Carousel End -->
                                 
                                 </div>
                           
                           
                           </div><!-- .row End -->
                        </div><!-- .container End -->
               
               </div>
               <!-- Intro End -->
         
         </header>
         <!-- Header -->
         
         
         <!-- Content -->
         <div id="content">
            
               <!-- Get Started Section -->
               <section id="get-started" class="clearfix" data-scroll-index="1">
                  
                     <!-- Get Started -->
                     <div class="get-started">
                     
                           <div class="container">
                              <div class="row">
                        
                                       <!-- Heading -->
                                       <div class="col-md-8 col-md-offset-2 heading center">
                                          <h2>Не пропусти то, что тебе интересно</h2>
                                          <p class="subheadline">Больше не надо заходить каждую неделю на десятки сайтов и смотреть, какие есть новые события. Даже не надо мониторить десятки групп ВКонтакте.
                                            Подпишись на организации, которые тебе интересны или которые рядом с тобой, и ты всегда будешь в курсе.</p>
                                       </div>
                                       <!-- Heading End -->
                                 
                                       <!-- Carousel -->
                                       <div class="col-md-12">
                                    
                                             <div id="carousel" class="owl-carousel">
                                          
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="icon-wrap wow fadeIn" data-wow-offset="300">
                                                         <i class="fa fa-building-o icon"></i>
                                                         <h3>Предложите свою организацию</h3>
                                                         <p>Проводите события и хотите получать доступ к аудитории? Предложите свою организацию и мы предоставим Вам аккаунт редактора, чтобы Вы могли публиковать информацию о событиях.</p>
                                                      </div>
                                                   </div>
                                             
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="icon-wrap wow fadeIn" data-wow-delay="0.5s" data-wow-offset="300">
                                                         <i class="fa fa-pencil icon"></i>
                                                         <h3>Публикуйте события</h3>
                                                         <p>Создавайте события с помощью приложений или браузера. На публикацию события уходит не больше 5 минут! Не забывайте устанавливать режимы уведомлений.</p>
                                                      </div>
                                                   </div>
                                             
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="icon-wrap wow fadeIn" data-wow-delay="1s" data-wow-offset="300">
                                                         <i class="fa fa-line-chart icon"></i>
                                                         <h3>Анализируйте результаты</h3>
                                                         <p>Привлекайте пользователей, получайте аналитику по охвату аудитории и поведению на сайте и в мобильных приложениях. Больше событий - больше охват и больше статистики.</p>
                                                      </div>
                                                   </div>
                                             
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="icon-wrap">
                                                         <i class="fa fa-sign-in icon"></i>
                                                         <h3>Авторизуйся</h3>
                                                         <p>Авторизуйся в системе с помощью одной из социальных сетей.</p>
                                                      </div>
                                                   </div>
                                             
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="icon-wrap">
                                                         <i class="fa fa-list-ol icon"></i>
                                                         <h3>Подпишись на организации</h3>
                                                         <p>Найди интересующие тебя организации в каталоге, который разбит на категории. Не нашел интересную организацию? Расскажи им об Evendate.</p>
                                                      </div>
                                                   </div>
                                             
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="icon-wrap">
                                                         <i class="fa fa-check icon"></i>
                                                         <h3>Будь в курсе</h3>
                                                         <p>Получай уведомления о новых событиях, добавляй в избранное то, что тебе интересно и смотри, что привлекло твоих друзей.</p>
                                                      </div>
                                                   </div>
                                       
                                             </div>
                                 
                                       </div>
                                       <!-- Carousel End -->
                        
                           
                              </div><!-- .row End -->
                        </div><!-- .container End -->
                        
                     </div>
                     <!-- Get Started End -->
                     
               </section>
               <!-- Get Started Section End -->
               
               
               
               <!-- Features Section -->
               <section id="features" class="clearfix" data-scroll-index="2">
               
                     <!-- Feature One -->
                     <div class="feature">
                     
                              <!-- Overlay -->
                              <div class="overlay-silver bg"></div>
                              <!-- Overlay --> 
                  
                              <div class="container">
                                 <div class="row">

                                 
                                          <!-- Features Content -->



                                   <div class="col-sm-6 col-md-6">
                                     <img class="img-responsive first wow fadeInLeft" src="/app/landing/img/bg/desktop.png" alt="">
                                   </div>
                                          <div class="col-sm-6 col-md-6">
                                    
                                                <!-- Heading -->
                                                <div class="heading">
                                                   <h2>Держите свою аудиторию при себе</h2>
                                                   <p class="subheadline">Публикуйте события и пользователи получат уведомления о них. Привлекайте новых участников и держите в курсе старых.</p>
                                                </div>
                                                <!-- Heading End -->
                                       
                                                <!-- Features List -->                                         
                                                <div class="feature-block">
                                                   <i class="fa fa-rocket"></i>
                                                   <h3>Контролируйте </h3>
                                                   <p>Получайте статистику по каждому событию в режиме реального времени. Держите своих постоянных клиентов в курсе всего.</p>
                                                </div>
                                          
                                                <div class="feature-block">
                                                   <i class="fa fa-cogs"></i>
                                                   <h3>Настраивайте уведомления</h3>
                                                   <p>Установите режимы уведомлений о событии для пользователей и они точно увидят Ваше событие и не пропустят его.</p>
                                                </div>
                                                <!-- Features List End -->
                                 
                                          </div>
                                          <!-- Features Content End -->
                        
                        
                                 </div><!-- .row End -->
                              </div><!-- .container End -->
                     
                     </div>
                     <!-- Feature One End -->
                     

               
               </section>
               <!-- Features Section End -->

               <!-- Features Section -->
               <section id="features2" class="clearfix" data-scroll-index="3">


                 <!-- Feature Two -->
                 <div class="feature">

                   <div class="container">
                     <div class="row">


                       <!-- Features Content -->
                       <div class="col-sm-6 col-md-6">

                         <!-- Heading -->
                         <div class="heading">
                           <h2>Не пропусти события и друзей </h2>
                           <p class="subheadline">Подписывайся на интересные организации и будь в курсе, куда собираются пойти твои друзья. Забудь про мониторинг сайтов и ВКонтакте в поисках интересных событий.</p>
                         </div>
                         <!-- Heading End -->

                         <!-- Features List -->
                         <div class="feature-block">
                           <i class="fa fa-list-ul"></i>
                           <h3>Много организаций</h3>
                           <p>События от многих организаций в одном месте, которое не надо мониторить, а само тебе подскажет что и когда. Просто подпишись на интересное.</p>
                         </div>

                         <div class="feature-block">
                           <i class="fa fa-thumbs-o-up"></i>
                           <h3>Добавляй в избранное</h3>
                           <p>Добавляй события в избранное, чтобы точно не пропустить самое интересное, и не забывай смотреть, что твои друзья считают интересным.</p>
                         </div>
                         <!-- Features List End -->

                       </div>

                       <div class="col-sm-6 col-md-6">
                         <img class="img-responsive third wow fadeInRight" src="/app/landing/img/bg/phone1.png" alt="" data-wow-offset="300">
                         <img class="img-responsive fourth wow fadeInRight" src="/app/landing/img/bg/phone4.png" alt="" data-wow-delay="0.5s" data-wow-offset="300">
                       </div>
                       <!-- Features Content End -->


                     </div><!-- .row End -->
                   </div><!-- .container End -->

                 </div>
                 <!-- Feature Two End -->



               </section>
               <!-- Features Section End -->
               
               
               
               <!-- Download Section -->
               <section id="download" class="clearfix">
                  
                     <!-- Download -->
                     <div class="download">
                     
                           <!-- Overlay -->
                           <div class="overlay-silver bg"></div>
                           <!-- Overlay --> 
                        
                           <div class="container">
                              <div class="row">
                                 
                              
                                       <div class="col-md-8 col-md-offset-2">
                                       
                                             <!-- Heading -->
                                             <div class="heading center">
                                                <h2>Скачай приложение</h2>
                                                <p class="subheadline">Приложения для iOS и Android с календарем, настройкой уведомлений, лентой мероприятий и отличным дизайном помогут тебе упорядочить события.</p>
                                             </div>
                                             <!-- Heading End -->
                                             
                                             <!-- Download Buttons -->                                            .
                                             <ul class="dw-btns">
                                                <li><a data-toggle="tooltip" data-placement="top" title="Скачать для iOS. Скоро..."><i class="fa fa-apple"></i></a></li>
                                                <li><a data-toggle="tooltip" data-placement="top" title="Скачать для Android.  Скоро..."><i class="fa fa-android"></i></a></li>
                                             </ul>                                            
                                             <!-- Download Buttons End -->   
                                             
                                             <!-- Tooptips -->
                                             <div class="tooltip-left wow fadeIn" data-wow-delay="2s">
                                                <div class="arrow"></div>
                                                <p>Скоро версии для планшетов</p>
                                             </div>
                           
                                             <div class="tooltip-right wow fadeIn" data-wow-delay="3s">
                                                <div class="arrow"></div>
                                                <p>Простое в использовании</p>
                                             </div>                           
                                             <!-- Tooptips End -->                                                                                      
                                             
                                       </div>
                              
                              
                              </div><!-- .row End -->
                           </div><!-- .container End -->
                           
                           <!-- Image -->
                           <img class="img-responsive first wow fadeInUp" src="/app/landing/img/bg/ipad.png" alt="" data-wow-offset="300">
                           <img class="img-responsive second wow fadeInUp" src="/app/landing/img/bg/phones.png" alt="" data-wow-delay="0.5s" data-wow-offset="300">
                     
                     </div>
                     <!-- Download End -->
               
               </section>
               <!-- Download Section End -->
               
               
               
               <!-- Gallery Section -->
               <section id="gallery" class="clearfix">
               
                     <!-- Gallery -->
                     <div class="gallery">
                        
                           <div class="container">
                              <div class="row">
                                 
                                       <div class="col-md-8 col-md-offset-2">
                                          
                                             <!-- Heading -->
                                             <div class="heading center">
                                                <h2>Как это выглядит</h2>
                                                <p class="subheadline"></p>
                                             </div>
                                             <!-- Heading End -->
                                       
                                       </div>
                                       
                                       <div class="col-md-12">
                                          
                                             <div id="carousel-gallery" class="owl-carousel">
                                                
                                                   <!-- Item -->
                                                   <div class="wow fadeIn" data-wow-offset="300">
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen3.png" title=""><img class="img-responsive" src="/app/landing/img/bg/screen3.png" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div class="wow fadeIn" data-wow-delay="0.5s" data-wow-offset="300">
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen4.png" title=""><img class="img-responsive" src="/app/landing/img/bg/screen4.png" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div class="wow fadeIn" data-wow-delay="1s" data-wow-offset="300">
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen1.png" title=""><img class="img-responsive" src="/app/landing/img/bg/screen1.png" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div class="wow fadeIn" data-wow-delay="1.5s" data-wow-offset="300">
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen2.png" title=""><img class="img-responsive" src="/app/landing/img/bg/screen2.png" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen5.png" title=""><img class="img-responsive" src="/app/landing/img/bg/screen5.png" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen6.png" title=""><img class="img-responsive" src="/app/landing/img/bg/screen6.png" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen7.jpg" title=""><img class="img-responsive" src="/app/landing/img/bg/screen7.jpg" alt=""></a>
                                                   </div>
                                                   
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen8.jpg" title=""><img class="img-responsive" src="/app/landing/img/bg/screen8.jpg" alt=""></a>
                                                   </div>

                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen9.jpg" title=""><img class="img-responsive" src="/app/landing/img/bg/screen9.jpg" alt=""></a>
                                                   </div>

                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen10.jpg" title=""><img class="img-responsive" src="/app/landing/img/bg/screen10.jpg" alt=""></a>
                                                   </div>

                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen11.jpg" title=""><img class="img-responsive" src="/app/landing/img/bg/screen11.jpg" alt=""></a>
                                                   </div>
                                                   <!-- Item -->
                                                   <div>
                                                      <div class="ico"><i class="fa fa-search"></i></div>
                                                      <a href="/app/landing/img/bg/screen12.jpg" title=""><img class="img-responsive" src="/app/landing/img/bg/screen12.jpg" alt=""></a>
                                                   </div>
                                             </div>
                                       
                                       </div>
                              
                              
                              </div><!-- .row End -->
                           </div><!-- .container End -->
                     
                     </div>
                     <!-- Gallery End -->
                  
               </section>
               <!-- Gallery Section End -->




           <!-- Newsletter Section -->
           <section id="newsletter" class="clearfix">

             <!-- Newsletter -->
             <div class="newsletter">

               <div class="container">
                 <div class="row">

                   <div class="col-md-8 col-md-offset-2">

                     <!-- Heading -->
                     <div class="heading center">
                       <h2>Будь первым</h2>
                       <p class="subheadline">Мы отправим уведомление, как только приложения появятся в официальных магазинах Apple App Store и Google Play.</p>
                     </div>
                     <!-- Heading End -->


                       <!-- Contact Form -->
                       <div class="contact-message subscribe"></div>
                       <!-- Subscribe Form -->
                     <form id="newsletter-form" class="clearfix">
                       <input type="email" name="mc-email" id="mc-email" class="input-field form-control" placeholder="E-Mail">
                       <label class="subscribe-message" style="text-align: center;"></label>
                       <input type="hidden" value="subscribe" name="type">
                       <input type="button" id="subscribe-btn" value="Отправить!" name="subscribe-submit" class="submit">
                     </form>
                     <!-- Subscribe Form End -->

                   </div>

                 </div><!-- .row End -->
               </div><!-- .container End -->

             </div>
             <!-- Newsletter End -->

           </section>
           <!-- Newsletter Section End -->


           <!-- Testimonials Section -->
               <!--<section id="testimonials" class="clearfix">-->
               <!-- -->
                     <!--&lt;!&ndash; Testimonials &ndash;&gt;-->
                     <!--<div class="testis">-->
                     <!-- -->
                           <!--&lt;!&ndash; Overlay &ndash;&gt;-->
                           <!--<div class="overlay-silver bg"></div>-->
                           <!--&lt;!&ndash; Overlay &ndash;&gt; -->
                        <!-- -->
                           <!--<div class="container">-->
                              <!--<div class="row">-->
                                 <!-- -->
                              <!-- -->
                                       <!--<div class="col-md-8 col-md-offset-2">-->
                                          <!-- -->
                                             <!--&lt;!&ndash; Heading &ndash;&gt;-->
                                             <!--<div class="heading center">-->
                                                <!--<h2>More than 1.000 Happy Customers!</h2>-->
                                                <!--<p class="subheadline">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut abore et dolore magna</p>-->
                                             <!--</div>-->
                                             <!--&lt;!&ndash; Heading End &ndash;&gt;-->
                                             <!-- -->
                                             <!--&lt;!&ndash; Testi-Carousel &ndash;&gt;-->
                                             <!--<div id="testi-carousel" class="owl-carousel">-->
                                                <!-- -->
                                                   <!--<div>-->
                                                      <!--<blockquote>-->
                                                         <!--<img class="img-responsive img-circle" src="/app/landing/img/bg/testi.jpg" alt="">-->
                                                         <!--<cite>John Doe <span>Co-Founder of Chappi</span></cite>-->
                                                         <!--<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>-->
                                                      <!--</blockquote>-->
                                                   <!--</div>-->
                                                   <!-- -->
                                                   <!--<div>-->
                                                      <!--<blockquote>-->
                                                         <!--<img class="img-responsive img-circle" src="/app/landing/img/bg/testi.jpg" alt="">-->
                                                         <!--<cite>John Doe <span>Co-Founder of Chappi</span></cite>-->
                                                         <!--<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>-->
                                                      <!--</blockquote>-->
                                                   <!--</div>-->
                                                   <!-- -->
                                                   <!--<div>-->
                                                      <!--<blockquote>-->
                                                         <!--<img class="img-responsive img-circle" src="/app/landing//app/landing/img/bg/testi.jpg" alt="">-->
                                                         <!--<cite>John Doe <span>Co-Founder of Chappi</span></cite>-->
                                                         <!--<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>-->
                                                      <!--</blockquote>-->
                                                   <!--</div>-->
                                             <!-- -->
                                             <!--</div>-->
                                             <!--&lt;!&ndash; Testi-Carousel End &ndash;&gt;-->
                                       <!-- -->
                                       <!--</div>-->
                              <!-- -->
                              <!-- -->
                              <!--</div>&lt;!&ndash; .row End &ndash;&gt;-->
                           <!--</div>&lt;!&ndash; .container End &ndash;&gt;-->
                     <!-- -->
                     <!--</div>-->
                     <!--&lt;!&ndash; Testimonials End &ndash;&gt;-->
               <!-- -->
               <!--</section>-->
               <!-- Testimonials Section End -->



               <!-- Pricing Section -->
               <section id="pricing" class="clearfix" data-scroll-index="4">

                     <!-- Price -->
                     <div class="pricing overlay-gradient">

                           <div class="container">
                              <div class="row">

                                       <div class="col-md-8 col-md-offset-2">

                                             <!-- Heading -->
                                             <div class="heading center inverted">
                                                <h2>Полностью бесплатно и без рекламы</h2>
                                               <p class="subheadline">Авторизуйся сейчас и начни пользоваться веб версией</p>
                                             </div>
                                             <!-- Heading End -->

                                       </div>

                                       <div class="col-sm-12 col-md-12 inverted">
                                             <!-- Price Table -->
                                         Войти через:
                                         <button class="btn vk-auth-btn">
                                           <i class="fa fa-vk"></i> ВКонтакте
                                         </button>
                                         <button class="btn google-plus-btn">
                                           <i class="fa fa-google-plus"></i> Google Plus
                                         </button>
                                         <button class="btn facebook-btn">
                                           <i class="fa fa-facebook"></i> Facebook
                                         </button>
                                             <!-- Price Table End -->

                                       </div>

                              </div><!-- .row End -->
                           </div><!-- .container End -->

                     </div>
                     <!-- Price -->

               </section>
               <!-- Pricing Section End -->

               
               
               <!-- Contact Section -->
               <section id="contact" class="clearfix" data-scroll-index="5">
                  
                     <!-- Contact -->
                     <div class="contact">
                        
                           <div class="container">
                              <div class="row">
                                 
                                       <div class="col-md-8 col-md-offset-2">
                                          
                                             <!-- Heading -->
                                             <div class="heading center">
                                                <h2>Хотите связаться с нами?</h2>
                                                <p class="subheadline">Если Вы хотите использовать Evendate для своей организации напишите нам!</p>
                                             </div>
                                             <!-- Heading End -->                                           
                                       
                                       </div>
                                       
                                       <!--<div class="col-md-6">-->
                                       <!-- -->
                                             <!--&lt;!&ndash; Adress &ndash;&gt;-->
                                             <!--<ul class="fast-contact">-->
                                                <!--&lt;!&ndash;<li><i class="fa fa-building-o"></i>Reafstreet<br>2530 Bay City<br>Los Angeles</li>&ndash;&gt;-->
                                                <!--&lt;!&ndash;<li><i class="fa fa-phone"></i>334-344-2323<br>944-343-4545</li>&ndash;&gt;-->
                                                <!--<li><i class="fa fa-envelope"></i><a href="index5.html#" title="">feedback@evendate.ru</a></li>-->
                                             <!--</ul>-->
                                             <!--&lt;!&ndash; Adress End &ndash;&gt;-->
                                          <!-- -->
                                             <!--&lt;!&ndash; Social Icons &ndash;&gt;-->
                                             <!--<ul class="socials">-->
                                                <!--<li><a href="index5.html#" title=""><i class="fa fa-facebook"></i></a></li>-->
                                                <!--<li><a href="index5.html#" title=""><i class="fa fa-twitter"></i></a></li>-->
                                                <!--<li><a href="index5.html#" title=""><i class="fa fa-tumblr"></i></a></li>-->
                                             <!--</ul>-->
                                             <!--&lt;!&ndash; Social Icons End &ndash;&gt;-->
                                          <!-- -->
                                       <!--</div>-->
                                       
                                       <div class="col-md-6 col-md-offset-3">
                                 
                                             <!-- Contact Form --> 
                                             <div class="contact-message feebdack"></div>
                                                  
                                             <form role="form" method="post" action="#" name="contactform" id="contactform" class="clearfix">
                                                <input type="text" name="contactname" id="contactname" class="input-field form-control" placeholder="Имя">
                                                <input type="text" name="contactemail" id="contactemail" class="input-field form-control" placeholder="E-Mail">
                                                <input type="text" name="organizationname" id="organizationname" class="input-field form-control" placeholder="Название организации">
                                                <textarea name="contactmessage" id="contactmessage" class="input-field form-control" placeholder="Комментарий"></textarea>
                                                <input type="submit" value="Отправить" name="submit" class="submit" id="submit">
                                             </form>
                                             <!-- Contact Form End --> 

                                       </div>
                              
                              </div><!-- .row End -->
                           </div><!-- .container End -->
                     
                     </div>
                     <!-- Contact End -->
               
               </section>
               <!-- Contact Section End -->
         
         </div>
         <!-- Content End -->
         
         
         <!-- Footer -->
         <footer>

               <div class="container">
                  <div class="row">
                     
                           <div class="col-md-12">
                              
                                 <!-- ScrollToTop -->         
                                 <a class="scrollup" href="#" title=""><i class="fa fa-angle-up"></i></a>
                                 <!-- ScrollToTop End -->
                                 
                                 <p>Все права защищены - Evendate &copy; 2015</p>
                           
                           </div>
                  
                  </div><!-- .row End -->
               </div><!-- .container End -->
         
         </footer>
         <!-- Footer -->

	   
         <!-- Javascript Files -->
         <script type="text/javascript" src="/app/landing/js/jquery-1.11.2.min.js"></script>
        <script type="text/javascript" src="/app/landing/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="/app/landing/js/jquery.easing.1.3.js"></script>
         <script type="text/javascript" src="/app/landing/js/scrollIt.js"></script>
         <script type="text/javascript" src="/app/landing/js/swiper.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/owl.carousel.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/jquery.magnific-popup.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/wow.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/jquery.stellar.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/jquery.ajaxchimp.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/jquery.particleground.min.js"></script>
         <script type="text/javascript" src="/app/landing/js/custom.js"></script>

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
