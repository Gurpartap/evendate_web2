<?php
require_once 'v1-backend/bin/db.php';
require_once 'v1-backend/bin/Class.Result.php';
require_once 'v1-backend/users/Class.AbstractUser.php';
require_once 'v1-backend/users/Class.User.php';
require_once 'v1-backend/tags/Class.TagsCollection.php';
try {
    $user = new User($__db);
    if (isset($_GET['logout']) && $_GET['logout'] == true) {
        $user->logout();
    } else {
        header('Location: /feed');
        die();
    }
} catch (Exception $e) {
    if (!isset($_GET['force_web'])) {
        $useragent = $_SERVER['HTTP_USER_AGENT'];

        if (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i', $useragent) || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i', substr($useragent, 0, 4)))
            header('Location: /mobile');
    }
}
$title = 'Evendate';
require_once('landing/header.php');
?>
<!doctype html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <title>Evendate</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <meta name="twitter:card" content="app">
    <meta name="twitter:site" content="@YourPrimer">
    <meta name="twitter:description"
          content="Primer is a fast, easy way to learn new digital marketing skills. You can brush up on the basics or explore advanced topics, and you’ll get personalized next steps with each lesson.">
    <meta name="twitter:app:country" content="US">
    <meta name="twitter:app:name:iphone" content="Primer">
    <meta name="twitter:app:id:iphone" content="918628107">
    <meta name="twitter:app:name:ipad" content="Evendate">
    <meta name="twitter:app:id:ipad" content="918628107">
    <meta name="twitter:app:name:googleplay" content="Evendate">
    <meta name="twitter:app:id:googleplay" content="com.google.android.apps.primer">

    <meta property="og:title" content="Primer | Marketing Lessons from Google">
    <meta property="og:url" content="https://www.yourprimer.com">
    <meta property="og:description"
          content="Primer is a fast, easy way to learn new digital marketing skills. You can take lessons in advertising, content, measurement, and strategy wherever and whenever you have 5 minutes free.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://services.google.com/fh/files/misc/treatment_lunch.jpg"/>

    <link href="app/assets/css/style.min.css" rel="stylesheet">
    <link href="app/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="vendor/fontawesome/css/font-awesome.min.css" rel="stylesheet">

</head>
<body class="home-page fader">


<div class="ref-message">
    <div class="fluid-width">
        <a class="close-ref" href="index.html">
            <svg fill="#222222" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        </a>
        <h3 class="ref-title">Скачай приложение прямо сейчас.
            <a class="download-link-button" target="_blank"
               href="https://play.google.com/store/apps/details?id=ru.evendate.android"
               data-ga-label="Android from Banner">
                <svg width="30px" height="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-3.5 -3.5 55 55"
                     enable-background="new -3.5 -3.5 55 55" xml:space="preserve">
              <path fill="#FFFFFF" d="M12,36c0,1.1,0.9,2,2,2h2v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h4v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h2c1.1,0,2-0.9,2-2V16H12V36z
                 M7,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3s3-1.3,3-3V19C10,17.3,8.7,16,7,16z M41,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3
                s3-1.3,3-3V19C44,17.3,42.7,16,41,16z M31.1,4.3l2.6-2.6c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3,2.9C27.7,2.5,25.9,2,24,2
                c-1.9,0-3.7,0.5-5.3,1.3l-3-3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.6,2.6C13.9,6.5,12,10,12,14h24C36,10,34,6.5,31.1,4.3z M20,10h-2
                V8h2V10z M30,10h-2V8h2V10z"/>
            </svg>
            </a>

            <a class="download-link-button js-ga-track" target="_blank"
               href="https://itunes.apple.com/us/app/evendate/id1044975200?mt=8"
               data-ga-label="iOS from Banner">
                <svg width="30px" height="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-3.5 -3.5 55 55"
                     enable-background="new -3.5 -3.5 55 55" xml:space="preserve">
              <g>
                  <g id="svg_1">
                      <path fill="#FFFFFF" d="M36.8,24.9c0.1,7.1,6.2,9.4,6.3,9.5c-0.1,0.2-1,3.4-3.2,6.7c-1.9,2.8-4,5.7-7.2,5.7c-3.1,0.1-4.1-1.9-7.7-1.9
                    c-3.6,0-4.7,1.8-7.7,1.9c-3.1,0.1-5.4-3.1-7.4-5.9c-4-5.8-7.1-16.4-3-23.6c2-3.6,5.7-5.8,9.7-5.9c3-0.1,5.9,2,7.7,2
                    c1.8,0,5.3-2.5,9-2.1c1.5,0.1,5.8,0.6,8.6,4.6C41.6,16.1,36.7,18.9,36.8,24.9 M30.9,7.5c1.6-2,2.7-4.7,2.4-7.5
                    c-2.4,0.1-5.2,1.6-6.9,3.5c-1.5,1.8-2.8,4.6-2.5,7.2C26.6,11,29.2,9.4,30.9,7.5"/>
                  </g>
              </g>
            </svg>
            </a>
        </h3>
    </div>
</div>


<div class="page-overlay-wrapper">
    <div class="fade-gradient"></div>

    <div class="overlay-sections">
        <section class="faq-section overlay-section">
            <div class="fade-in">
                <div class="fluid-width constrain-large text-center">
                    <h2 class="page-title">Войдите через социальную сеть:</h2>
                    <a href="#" class="social-btn vk-btn vk-auth-btn">
                        <i class="fa fa-vk"></i> ВКонтакте
                    </a>
                    <a href="#" class="social-btn fb-btn facebook-btn">
                        <i class="fa fa-facebook"></i> Facebook
                    </a>
                    <a href="#" class="social-btn google-lus-btn google-plus-btn">
                        <i class="fa fa-google"></i> Google
                    </a>
                </div>
            </div>

        </section>
    </div>

    <footer class="global-footer footer">
        <div class="fluid-width mobile-full-width">
            <div class="footer-branding float-left">
                <div class="float-right footer-social-links">
                    <a data-ga-label="Twitter" target="_blank" href="https://twitter.com/yourprimer"
                       class="footer-social-link js-ga-track">
                        <svg width="20px" height="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="72.4 0 24 24"
                             enable-background="new 72.4 0 24 24" xml:space="preserve">
                <path fill="#586971" d="M91.1,8.5c0,0.2,0,0.3,0,0.5c0,4.6-3.5,10.1-9.9,10.1c-1.9,0-3.8-0.5-5.4-1.4c0.3,0,0.5,0,0.8,0c1.6,0,3.2-0.6,4.3-1.6
                  c-1.6,0-2.9-1.1-3.2-2.4c0.2,0,0.5,0,0.6,0c0.3,0,0.6,0,1-0.2c-1.6-0.3-2.9-1.8-2.9-3.5l0,0c0.5,0.3,1,0.5,1.6,0.5
                  c-1-0.6-1.6-1.8-1.6-2.9c0-0.6,0.2-1.1,0.5-1.8c1.9,2.1,4.5,3.4,7.4,3.5c0-0.3,0-0.5,0-0.8c0-1.9,1.6-3.5,3.5-3.5
                  c1,0,1.9,0.5,2.6,1.1c0.8-0.2,1.6-0.5,2.2-0.8c-0.3,0.8-0.8,1.4-1.6,1.9c0.6,0,1.4-0.3,2.1-0.5C92.4,7.4,91.9,8,91.1,8.5z"/>
              </svg>
                    </a>
                    <a data-ga-label="G+" target="_blank" href="https://plus.google.com/+PrimerApp"
                       class="footer-social-link js-ga-track">
                        <svg width="20px" height="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24"
                             enable-background="new 0 0 24 24" xml:space="preserve">
                <g>
                    <path fill="#586971" d="M8,10.7V13h4c-0.1,1.3-1.2,3.1-3.9,3.1c-2.3,0-4.2-1.8-4.2-4.2S5.7,7.7,8,7.7c1.3,0,2.3,0.5,2.7,1.1l1.7-1.7
                    C11.3,6,9.8,5.4,8,5.4c-3.7,0-6.6,2.9-6.6,6.6s2.9,6.6,6.6,6.6c3.9,0,6.4-2.7,6.4-6.5c0-0.5-0.1-1-0.1-1.3L8,10.7L8,10.7z"/>
                    <polygon fill="#586971"
                             points="20,9.2 18.6,9.2 18.6,11.9 16,11.9 16,13.2 18.6,13.2 18.6,15.9 20,15.9 20,13.2 22.6,13.2 22.6,11.9 20,11.9  "/>
                </g>
              </svg>

                    </a>
                    <a data-ga-label="Medium" target="_blank" href="https://medium.com/@PrimerApp"
                       class="footer-social-link js-ga-track">
                        <svg width="20px" height="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="137.4 0 24 24"
                             enable-background="new 137.4 0 24 24" xml:space="preserve">
                <path fill="#586971" d="M156.7,7.9h-0.6c-0.2,0-0.5,0.3-0.5,0.5v7.1c0,0.2,0.3,0.5,0.5,0.5h0.6v1.7h-5.2v-1.7h1.1V8.5h-0.1l-2.5,9.2h-2l-2.5-9.2
                h-0.1v7.5h1.1v1.7h-4.4v-1.7h0.6c0.2,0,0.5-0.3,0.5-0.5V8.4c0-0.2-0.3-0.5-0.5-0.5h-0.6V6.2h5.4l1.8,6.7h0l1.8-6.7h5.4V7.9z"/>
              </svg>
                    </a>
                </div>

                <div class="footer-nav-links float-right">
                    <a data-ga-label="ContactUs" class="footer-nav-link js-ga-track" target="_blank"
                       href="mailto:hello@yourprimer.com">+7 (495) 641-6105</a>
                    <a data-ga-label="Terms" class="footer-nav-link js-ga-track" target="_blank"
                       href="https://www.google.com/intl/en/policies/terms/">Обратная связь</a>
                </div>
            </div>
        </div>
    </footer>

</div>

<div class="header-wrapper">
    <header class="header fluid-width mobile-full-width">
        <a class="fader-link close-overlay" href="/" data-ga-label="Home" data-overlay-target="">
            <svg width="135px" height="24.70001px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24.70001">
                <path id="evendate_logo_text" transform="translate(-2.375 -0.69998)" fill="#ffffff"
                      d="M18.675,16.4c0-5.3-3-8.5-8.1-8.5a8.42015,8.42015,0,0,0-8.2,8.7,8.38058,8.38058,0,0,0,8.5,8.8,7.55515,7.55515,0,0,0,7.5-5.2l-3.7-1.2a3.57051,3.57051,0,0,1-3.7,2.5,3.98288,3.98288,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,18.675,16.4Zm-11.8-1.6a3.55717,3.55717,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Zm24.3-6.3-3.9,11-4.1-11h-4.9l6.7,16.4h4.4l6.5-16.4h-4.7Zm20.6,7.9c0-5.3-3-8.5-8.1-8.5a8.25038,8.25038,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55522,7.55522,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98293,3.98293,0,0,1-4.1-3.7h11.7A13.79661,13.79661,0,0,0,51.775,16.4Zm-11.7-1.6a3.55712,3.55712,0,0,1,3.7-3.2,3.36289,3.36289,0,0,1,3.7,3.2h-7.4ZM62.975,8a5.385,5.385,0,0,0-4.7,2.5v-2h-4.3V24.9h4.4V15.4c0-1.9,1.1-3.4,3.1-3.4,2.1,0,3,1.4,3,3.3v9.6h4.4V14.5C68.875,10.9,66.975,8,62.975,8Zm24.8,13.9V0.7h-4.4v9.4c-0.5-.9-1.8-2-4.6-2-4.6,0-7.9,3.8-7.9,8.6,0,5,3.3,8.6,8,8.6a5.101,5.101,0,0,0,4.6-2.3,7.75394,7.75394,0,0,0,.2,1.9h4.2A26.28237,26.28237,0,0,1,87.775,21.9Zm-8.3-.6c-2.4,0-4.1-1.8-4.1-4.7s1.8-4.6,4.1-4.6,4,1.6,4,4.6S81.675,21.3,79.475,21.3Zm25.2,1V14.2c0-3.3-1.9-6.2-7.1-6.2-4.4,0-6.8,2.8-7,5.4l3.9,0.8a2.92541,2.92541,0,0,1,3.1-2.7c1.9,0,2.8,1,2.8,2.1a1.19858,1.19858,0,0,1-1.2,1.2l-4,.6c-2.8.4-5,2-5,5,0,2.6,2.1,4.9,5.6,4.9a5.40058,5.40058,0,0,0,4.8-2.4,12.30577,12.30577,0,0,0,.2,2h4.1A18.36784,18.36784,0,0,1,104.675,22.3Zm-4.3-4.2c0,3-1.8,3.9-3.6,3.9a1.89565,1.89565,0,0,1-2.1-1.9,2.094,2.094,0,0,1,2-2.1l3.7-.6v0.7Zm16.3-5.8V8.5h-3.3V3.6h-4.1V5.9a2.33883,2.33883,0,0,1-2.5,2.6h-0.8v3.9h3V20c0,3.2,2,5.1,5.2,5.1a5.9567,5.9567,0,0,0,2.5-.4V21a4.92317,4.92317,0,0,1-1.4.1,1.61828,1.61828,0,0,1-1.9-1.9V12.3h3.3Zm17.2,4.1a10.91279,10.91279,0,0,0-.47-3.3h-0.03a5.49026,5.49026,0,0,1-5.47-4.98,9.60458,9.60458,0,0,0-2.13-.22,8.25043,8.25043,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55517,7.55517,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98284,3.98284,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,133.875,16.4Zm-11.7-1.6a3.55721,3.55721,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Z"></path>
                <circle id="evendate_logo_dot" cx="131" cy="6.90002" r="4" fill="#f82969"></circle>
            </svg>

        </a>
        <div class="header-nav-links">
            <a class="header-nav-link hover-color organizations-link js-ga-track fader-link about-link about-header-link"
               data-ga-label="About" data-overlay-target="about-section" href="about.html">Организаторам</a>
            <a class="header-nav-link faq-link hover-color js-ga-track fader-link faq-link faq-header-link"
               data-ga-label="FAQ"
               data-overlay-target="faq-section" href="faq.html">Войти</a>
        </div>
        <a class="menu" href="index.html">Menu</a>
    </header>
    <nav class="mobile-nav">
        <a class="mobile-nav-link js-ga-track about-link" data-ga-label="About" href="about.html">Организаторам</a>
        <a class="mobile-nav-link js-ga-track faq-link" data-ga-label="FAQ" href="faq.html">Войти</a>
    </nav>
</div>

<section class="fixed-content fluid-width">
    <div class="content">
        <div class="constrain">

            <div class="content-text">
                <div class="text-slide active" data-slide="0">
                    <h2 class="js-animate-this">Fit a lesson<br>in anywhere.</h2>
                    <div class="js-animate-this">
                        <p>Primer is a fast, easy way to learn new marketing skills. You can take our bite-sized lessons
                            wherever and whenever you have 5 minutes free.</p>
                        <div class="slide-cta">
                            <span>Войти через: </span>
                            <a class="slide-cta-button hover-fill js-ga-track" target="_blank"
                               href="https://play.google.com/store/apps/details?id=ru.evendate.android"
                               data-ga-label="Android">
                                <svg width="30px" height="30px" version="1.1" id="Layer_1"
                                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                     x="0px" y="0px" viewBox="-3.5 -3.5 55 55" enable-background="new -3.5 -3.5 55 55"
                                     xml:space="preserve">
                      <path fill="#FFFFFF" d="M12,36c0,1.1,0.9,2,2,2h2v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h4v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h2c1.1,0,2-0.9,2-2V16H12V36z
                         M7,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3s3-1.3,3-3V19C10,17.3,8.7,16,7,16z M41,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3
                        s3-1.3,3-3V19C44,17.3,42.7,16,41,16z M31.1,4.3l2.6-2.6c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3,2.9C27.7,2.5,25.9,2,24,2
                        c-1.9,0-3.7,0.5-5.3,1.3l-3-3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.6,2.6C13.9,6.5,12,10,12,14h24C36,10,34,6.5,31.1,4.3z M20,10h-2
                        V8h2V10z M30,10h-2V8h2V10z"/>
                    </svg>
                            </a>

                            <a class="slide-cta-button hover-fill js-ga-track" target="_blank"
                               href="https://itunes.apple.com/us/app/evendate/id1044975200?mt=8"
                               data-ga-label="iOS">
                                <svg width="30px" height="30px" version="1.1" id="Layer_1"
                                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                     x="0px" y="0px" viewBox="-3.5 -3.5 55 55" enable-background="new -3.5 -3.5 55 55"
                                     xml:space="preserve">
                      <g>
                          <g id="svg_1">
                              <path fill="#FFFFFF" d="M36.8,24.9c0.1,7.1,6.2,9.4,6.3,9.5c-0.1,0.2-1,3.4-3.2,6.7c-1.9,2.8-4,5.7-7.2,5.7c-3.1,0.1-4.1-1.9-7.7-1.9
                            c-3.6,0-4.7,1.8-7.7,1.9c-3.1,0.1-5.4-3.1-7.4-5.9c-4-5.8-7.1-16.4-3-23.6c2-3.6,5.7-5.8,9.7-5.9c3-0.1,5.9,2,7.7,2
                            c1.8,0,5.3-2.5,9-2.1c1.5,0.1,5.8,0.6,8.6,4.6C41.6,16.1,36.7,18.9,36.8,24.9 M30.9,7.5c1.6-2,2.7-4.7,2.4-7.5
                            c-2.4,0.1-5.2,1.6-6.9,3.5c-1.5,1.8-2.8,4.6-2.5,7.2C26.6,11,29.2,9.4,30.9,7.5"/>
                          </g>
                      </g>
                    </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="text-slide" data-slide="1">
                    <h2 class="js-animate-this">Get new topics every week.</h2>
                    <div class="js-animate-this">
                        <p>We’re constantly adding more lessons. So whether you need to brush up on the basics or
                            explore advanced subjects, Primer can teach it all to you in a no-nonsense, no-jargon
                            way.</p>
                        <div class="slide-cta">
                            <span>Войти через: </span>
                            <a class="slide-cta-button hover-fill js-ga-track" data-ga-label="Android" target="_blank"
                               href="https://play.google.com/store/apps/details?id=ru.evendate.android">
                                <svg width="30px" height="30px" version="1.1" id="Layer_1"
                                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                     x="0px" y="0px" viewBox="-3.5 -3.5 55 55" enable-background="new -3.5 -3.5 55 55"
                                     xml:space="preserve">
                      <path fill="#FFFFFF" d="M12,36c0,1.1,0.9,2,2,2h2v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h4v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h2c1.1,0,2-0.9,2-2V16H12V36z
                         M7,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3s3-1.3,3-3V19C10,17.3,8.7,16,7,16z M41,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3
                        s3-1.3,3-3V19C44,17.3,42.7,16,41,16z M31.1,4.3l2.6-2.6c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3,2.9C27.7,2.5,25.9,2,24,2
                        c-1.9,0-3.7,0.5-5.3,1.3l-3-3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.6,2.6C13.9,6.5,12,10,12,14h24C36,10,34,6.5,31.1,4.3z M20,10h-2
                        V8h2V10z M30,10h-2V8h2V10z"/>
                    </svg>
                            </a>

                            <a class="slide-cta-button hover-fill js-ga-track" data-ga-label="iOS" target="_blank"
                               href="https://itunes.apple.com/app/apple-store/id918628107?pt=9008&ct=9-8-2015-website&mt=8">
                                <svg width="30px" height="30px" version="1.1" id="Layer_1"
                                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                     x="0px" y="0px" viewBox="-3.5 -3.5 55 55" enable-background="new -3.5 -3.5 55 55"
                                     xml:space="preserve">
                      <g>
                          <g id="svg_1">
                              <path fill="#FFFFFF" d="M36.8,24.9c0.1,7.1,6.2,9.4,6.3,9.5c-0.1,0.2-1,3.4-3.2,6.7c-1.9,2.8-4,5.7-7.2,5.7c-3.1,0.1-4.1-1.9-7.7-1.9
                            c-3.6,0-4.7,1.8-7.7,1.9c-3.1,0.1-5.4-3.1-7.4-5.9c-4-5.8-7.1-16.4-3-23.6c2-3.6,5.7-5.8,9.7-5.9c3-0.1,5.9,2,7.7,2
                            c1.8,0,5.3-2.5,9-2.1c1.5,0.1,5.8,0.6,8.6,4.6C41.6,16.1,36.7,18.9,36.8,24.9 M30.9,7.5c1.6-2,2.7-4.7,2.4-7.5
                            c-2.4,0.1-5.2,1.6-6.9,3.5c-1.5,1.8-2.8,4.6-2.5,7.2C26.6,11,29.2,9.4,30.9,7.5"/>
                          </g>
                      </g>
                    </svg>
                            </a>

                        </div>
                    </div>
                </div>
                <div class="text-slide" data-slide="2">
                    <h2 class="js-animate-this"><br/>Learn by doing.</h2>
                    <p class="js-animate-this">Put your new knowledge to use right away. Each lesson ends with
                        personalized next steps that are automatically saved for you.</p>
                    <div class="slide-cta js-animate-this">
                        <span>Войти через: </span>
                        <a class="slide-cta-button hover-fill js-ga-track" data-ga-label="Android" target="_blank"
                           href="https://play.google.com/store/apps/details?id=com.google.android.apps.primer&referrer=utm_source%3Dwebsite%26utm_medium%3Dreferral%26utm_content%3Dbutton%26utm_campaign%3D2015-9-8-website">
                            <svg width="30px" height="30px" version="1.1" id="Layer_1"
                                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                 y="0px" viewBox="-3.5 -3.5 55 55" enable-background="new -3.5 -3.5 55 55"
                                 xml:space="preserve">
                    <path fill="#FFFFFF" d="M12,36c0,1.1,0.9,2,2,2h2v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h4v7c0,1.7,1.3,3,3,3s3-1.3,3-3v-7h2c1.1,0,2-0.9,2-2V16H12V36z
                       M7,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3s3-1.3,3-3V19C10,17.3,8.7,16,7,16z M41,16c-1.7,0-3,1.3-3,3v14c0,1.7,1.3,3,3,3
                      s3-1.3,3-3V19C44,17.3,42.7,16,41,16z M31.1,4.3l2.6-2.6c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3,2.9C27.7,2.5,25.9,2,24,2
                      c-1.9,0-3.7,0.5-5.3,1.3l-3-3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.6,2.6C13.9,6.5,12,10,12,14h24C36,10,34,6.5,31.1,4.3z M20,10h-2
                      V8h2V10z M30,10h-2V8h2V10z"/>
                  </svg>
                        </a>

                        <a class="slide-cta-button hover-fill js-ga-track" data-ga-label="iOS" target="_blank"
                           href="https://itunes.apple.com/app/apple-store/id918628107?pt=9008&ct=9-8-2015-website&mt=8">
                            <svg width="30px" height="30px" version="1.1" id="Layer_1"
                                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                                 y="0px" viewBox="-3.5 -3.5 55 55" enable-background="new -3.5 -3.5 55 55"
                                 xml:space="preserve">
                    <g>
                        <g id="svg_1">
                            <path fill="#FFFFFF" d="M36.8,24.9c0.1,7.1,6.2,9.4,6.3,9.5c-0.1,0.2-1,3.4-3.2,6.7c-1.9,2.8-4,5.7-7.2,5.7c-3.1,0.1-4.1-1.9-7.7-1.9
                          c-3.6,0-4.7,1.8-7.7,1.9c-3.1,0.1-5.4-3.1-7.4-5.9c-4-5.8-7.1-16.4-3-23.6c2-3.6,5.7-5.8,9.7-5.9c3-0.1,5.9,2,7.7,2
                          c1.8,0,5.3-2.5,9-2.1c1.5,0.1,5.8,0.6,8.6,4.6C41.6,16.1,36.7,18.9,36.8,24.9 M30.9,7.5c1.6-2,2.7-4.7,2.4-7.5
                          c-2.4,0.1-5.2,1.6-6.9,3.5c-1.5,1.8-2.8,4.6-2.5,7.2C26.6,11,29.2,9.4,30.9,7.5"/>
                        </g>
                    </g>
                  </svg>
                        </a>

                    </div>
                </div>
                <div class="text-slide text-slide-3 container-centered" data-slide="3">
                    <h2 class="js-animate-this">Выберите то, что интересно Вам</h2>
                    <div class="js-animate-this">
                        <div class="row">
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/education.png">
                                <span>Образование</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/art.png">
                                <span>Искусство</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/sport.png">
                                <span>Спорт</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/IT.png">
                                <span>IT</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/design.png">
                                <span>Дизайн</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/business.png">
                                <span>Стартапы и бизнес</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/bars.png">
                                <span>Клубы и бары</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 interests-block">
                                <img src="app/assets/img/objects/step-4/fun.png">
                                <span>Развлечения</span>
                                <div class="selected-overlay">
                                    <div class="selected-overlay-icon-wrapper">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <a href="#" class="auth-with-interests">Войти</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="device-frame">
                <div class="image-slides">
                    <img class="screen-shine init-image" src="app/assets/img/screen-shine.png"/>
                    <img class="image-slide init-image" alt="Advertising - How Remarketing Keeps Customers Coming Back"
                         src="app/assets/img/still1.jpg"/>
                    <img class="image-slide init-image"
                         alt="Content - Get Customers Interested by Telling a Great Story"
                         src="app/assets/img/still2.jpg"/>
                    <img class="image-slide init-image" alt="Lesson Recap - How Remarketing Keeps Customers Coming Back"
                         src="app/assets/img/still3.jpg"/>
                </div>
                <img class="device init-image" src="app/assets/img/device.png"/>
            </div>
        </div>
    </div>

</section>
<section class="scroll-container">
    <section class="scroll-section scroll-section-one" data-from-time="0.01" data-to-time="1.33"
             data-reverse-from-time="" data-reverse-to-time="">
        <div class="scroll-section-content">
            <img width="427" class="layer-object glasses initial-state init-image"
                 src="app/assets/img/objects/coffee.png"/>
            <img width="500" class="layer-object pencils initial-state init-image "
                 src="app/assets/img/objects/pencil.png"/>
            <img width="500" class="layer-object notebook initial-state init-image"
                 src="app/assets/img/objects/notebook.png"/>
            <img width="1660" class="section-bg section-bg-one initial-state init-image"
                 src="app/assets/img/shapes/pattern1.png"/>
        </div>

    </section>
    <section class="scroll-section scroll-section-two" data-from-time="1.50" data-to-time="2.67"
             data-reverse-from-time="6.73" data-reverse-to-time="8.07">
        <div class="scroll-section-content">
            <img width="552" class="layer-object coffee js-load-async"
                 data-image-src="app/assets/img/objects/donut.png"/>
            <img width="455" class="layer-object donut js-load-async"
                 data-image-src="app/assets/img/objects/glasses.png"/>
            <img width="520" class="layer-object spoon js-load-async"
                 data-image-src="app/assets/img/objects/spoon.png"/>
            <img width="1693" class="section-bg section-bg-two js-load-async"
                 data-image-src="app/assets/img/shapes/bg_cloud.png"/>
        </div>

    </section>
    <section class="scroll-section scroll-section-three" data-from-time="2.83" data-to-time="4.00"
             data-reverse-from-time="5.40" data-reverse-to-time="6.57">
        <div class="scroll-section-content">
            <img width="515" class="layer-object leash js-load-async"
                 data-image-src="app/assets/img/objects/playstation.png"/>
            <img width="418" class="layer-object newspaper js-load-async"
                 data-image-src="app/assets/img/objects/tickets2.png"/>
            <img width="422" class="layer-object sunglasses js-load-async"
                 data-image-src="app/assets/img/objects/headphones.png"/>
            <img width="1982" class="section-bg section-bg-three js-load-async"
                 data-image-src="app/assets/img/shapes/shapes2.png"/>
        </div>

    </section>
    <section class="scroll-section scroll-section-four" data-from-time="" data-to-time="" data-reverse-from-time="4.06"
             data-reverse-to-time="5.23">
        <div class="scroll-section-content">
            <img width="512" class="layer-object candy js-load-async"
                 data-image-src="app/assets/img/objects/Polaroid-Snap.png"/>
            <img width="515" class="layer-object passport js-load-async"
                 data-image-src="app/assets/img/objects/leash.png"/>
            <img width="1688" class="section-bg section-bg-four js-load-async"
                 data-image-src="app/assets/img/shapes/squares.png"/>
        </div>

    </section>
</section>

<footer class="footer fluid-width mobile-full-width">

    <a href="index.html" data-ga-label="DownArrow" class="down-arrow hover-fill js-ga-track">
        <svg width="30px" height="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60"
             enable-background="new 0 0 60 60" xml:space="preserve">
          <polygon fill="#FFFFFF" points="55.7,19.2 51.5,15.1 30,36.6 8.5,15.1 4.3,19.2 30,44.9 30,44.9 30,44.9 "/>
        </svg>
    </a>

    <div class="float-right footer-social-links">
        <a data-ga-label="G+" target="_blank" href="https://new.vk.com/evendate"
           class="footer-social-link hover-fill js-ga-track">
            <i class="fa fa-vk"></i>
        </a>
        <a data-ga-label="Twitter" target="_blank" href="https://twitter.com/evendate"
           class="footer-social-link hover-fill js-ga-track">
            <i class="fa fa-twitter"></i>
        </a>
        <a target="_blank" href="http://instagram.com/evendate"
           class="footer-social-link hover-fill js-ga-track">
            <i class="fa fa-instagram"></i>
        </a>
    </div>

    <div class="footer-nav-links float-right">
        <a data-ga-label="ContactUs" class="footer-nav-link js-ga-track" target="_blank"
           href="mailto:hello@yourprimer.com">+7 (495) 641-6105</a>
        <a data-ga-label="Terms" class="footer-nav-link js-ga-track" target="_blank"
           href="https://www.google.com/intl/en/policies/terms/">Обратная связь</a>
    </div>
</footer>

<footer class="global-footer footer">
    <div class="fluid-width mobile-full-width">

        <div class="float-right footer-social-links">
            <a data-ga-label="G+" target="_blank" href="https://new.vk.com/evendate"
               class="footer-social-link hover-fill js-ga-track">
                <i class="fa fa-vk"></i>
            </a>
            <a data-ga-label="Twitter" target="_blank" href="https://twitter.com/evendate"
               class="footer-social-link hover-fill js-ga-track">
                <i class="fa fa-twitter"></i>
            </a>
            <a target="_blank" href="http://instagram.com/evendate"
               class="footer-social-link hover-fill js-ga-track">
                <i class="fa fa-instagram"></i>
            </a>
        </div>

        <div class="footer-nav-links float-right">
            <a data-ga-label="ContactUs" class="footer-nav-link js-ga-track"
               href="#">+7 (495) 641-6105</a>
            <a data-ga-label="Terms" class="footer-nav-link js-ga-track" target="_blank"
               href="https://www.google.com/intl/en/policies/terms/">Обратная связь</a>
        </div>
    </div>
</footer>

<?php
require_once('landing/footer.php');
?>

<script src="app/assets/js/scripts.min.js"></script>
</body>
</html>