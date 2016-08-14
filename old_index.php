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
    <body>
    <header class="header_evendate">
        <div class="logo -v_centering">
            <a class="logo_link" title="Перейти на главную" href="index.php">
                <svg width="135px" height="24.70001" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24.70001">
                    <title>logo</title>
                    <path id="evendate_logo_text" transform="translate(-2.375 -0.69998)" fill="#fff"
                          d="M18.675,16.4c0-5.3-3-8.5-8.1-8.5a8.42015,8.42015,0,0,0-8.2,8.7,8.38058,8.38058,0,0,0,8.5,8.8,7.55515,7.55515,0,0,0,7.5-5.2l-3.7-1.2a3.57051,3.57051,0,0,1-3.7,2.5,3.98288,3.98288,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,18.675,16.4Zm-11.8-1.6a3.55717,3.55717,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Zm24.3-6.3-3.9,11-4.1-11h-4.9l6.7,16.4h4.4l6.5-16.4h-4.7Zm20.6,7.9c0-5.3-3-8.5-8.1-8.5a8.25038,8.25038,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55522,7.55522,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98293,3.98293,0,0,1-4.1-3.7h11.7A13.79661,13.79661,0,0,0,51.775,16.4Zm-11.7-1.6a3.55712,3.55712,0,0,1,3.7-3.2,3.36289,3.36289,0,0,1,3.7,3.2h-7.4ZM62.975,8a5.385,5.385,0,0,0-4.7,2.5v-2h-4.3V24.9h4.4V15.4c0-1.9,1.1-3.4,3.1-3.4,2.1,0,3,1.4,3,3.3v9.6h4.4V14.5C68.875,10.9,66.975,8,62.975,8Zm24.8,13.9V0.7h-4.4v9.4c-0.5-.9-1.8-2-4.6-2-4.6,0-7.9,3.8-7.9,8.6,0,5,3.3,8.6,8,8.6a5.101,5.101,0,0,0,4.6-2.3,7.75394,7.75394,0,0,0,.2,1.9h4.2A26.28237,26.28237,0,0,1,87.775,21.9Zm-8.3-.6c-2.4,0-4.1-1.8-4.1-4.7s1.8-4.6,4.1-4.6,4,1.6,4,4.6S81.675,21.3,79.475,21.3Zm25.2,1V14.2c0-3.3-1.9-6.2-7.1-6.2-4.4,0-6.8,2.8-7,5.4l3.9,0.8a2.92541,2.92541,0,0,1,3.1-2.7c1.9,0,2.8,1,2.8,2.1a1.19858,1.19858,0,0,1-1.2,1.2l-4,.6c-2.8.4-5,2-5,5,0,2.6,2.1,4.9,5.6,4.9a5.40058,5.40058,0,0,0,4.8-2.4,12.30577,12.30577,0,0,0,.2,2h4.1A18.36784,18.36784,0,0,1,104.675,22.3Zm-4.3-4.2c0,3-1.8,3.9-3.6,3.9a1.89565,1.89565,0,0,1-2.1-1.9,2.094,2.094,0,0,1,2-2.1l3.7-.6v0.7Zm16.3-5.8V8.5h-3.3V3.6h-4.1V5.9a2.33883,2.33883,0,0,1-2.5,2.6h-0.8v3.9h3V20c0,3.2,2,5.1,5.2,5.1a5.9567,5.9567,0,0,0,2.5-.4V21a4.92317,4.92317,0,0,1-1.4.1,1.61828,1.61828,0,0,1-1.9-1.9V12.3h3.3Zm17.2,4.1a10.91279,10.91279,0,0,0-.47-3.3h-0.03a5.49026,5.49026,0,0,1-5.47-4.98,9.60458,9.60458,0,0,0-2.13-.22,8.25043,8.25043,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55517,7.55517,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98284,3.98284,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,133.875,16.4Zm-11.7-1.6a3.55721,3.55721,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Z"></path>
                    <circle id="evendate_logo_dot" cx="131" cy="6.90002" r="4" fill="#f82969"></circle>
                </svg>
                <img class="float_logo" width="135px" height="24.70001" src="/app/img/brand_white.png">
            </a>
        </div>
        <div class="menu_all_item_container">
            <div class="menu_item_container">
                <span class="menu_item_text menu_item_container_active">ГЛАВНАЯ</span>
                <div class="header_menu_line"></div>
            </div>
            <div class="menu_item_container">
                <a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛЯМ</a>
            </div>
            <div class="menu_item_container">
                <a href="organizations.php" class="menu_item_text">ОРГАНИЗАТОРАМ</a>
            </div>
            <div class="menu_item_container">
                <a href="about.php#about" class="menu_item_text">О НАС</a>
            </div>
        </div>
        <div class="header_button_container">
            <button id="go" class="header_button" type="button"><span class="header_button_text">ВОЙТИ</span></button>
        </div>
    </header>


    <div class="position_main_part">
        <div style="background-image: url(landing/img/Main.jpg);" class="fon_img_main_page">
            <div class="position_in_fon">
                <div class="fon_text_container">
                    <div><span class="fon_text_top">Наполни жизнь событиями </span></div>
                    <div class="fon_text_bottom_container"><span class="fon_text_bottom">Собери интересные тебе места и не пропусти важные события</span>
                    </div>

                </div>
                <div class="login_container">
                    <div class="login_container_text"><span class="login_text">ВОЙТИ С ПОМОЩЬЮ</span></div>
                    <div>
                        <div class="login_img_container"><img src="/landing/img/vk_logo.jpg" id="vk_login"
                                                              class="img_login" data-type="vk"></div>
                        <div class="login_img_container"><img src="/landing/img/fb_logo.jpg" id="fb_login"
                                                              class="img_login" data-type="facebook"></div>
                        <div class="login_img_container"><img src="/landing/img/g+_logo.png" id="g_login"
                                                              class="img_login" data-type="google"></div>
                    </div>
                    <div>
                        <button class="login_button"><span class="login_button_text">ВОЙТИ БЕЗ АВТОРИЗАЦИИ</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <article class="fon_article">
            <section class="section_stay_in_touch">
                <div><span class="section_stay_in_touch_text_top">Будь в курсе событий!</span></div>
                <div class="section_stay_in_touch_text_bottom_container"><span
                        class="section_stay_in_touch_text_bottom">Подпишись на интересующие тебя источники, сформируй уникальную ленту новостей и с легкостью отслеживай события, которые происходят вокруг тебя!</span>
                </div>
            </section>
            <section class="section_steps">
                <div class="step_container">
                    <div><img src="/landing/img/pics/phone.png" height="175px" class="step_img"></div>
                    <div class="step_text_container">
                        <div><span class="step_text">Подпишись на организаторов</span></div>
                        <div class="otstup"><span class="step_user_text">Из подписок формируется лента событий</span>
                        </div>
                    </div>
                </div><!--
			-->
                <div class="step_container step_container_center">
                    <div><img src="/landing/img/pics/calendar.png" height="175px" class="step_img"></div>
                    <div class="step_text_container">
                        <div><span class="step_text">Добавляй события в избранное</span></div>
                    </div>
                    <div class="otstup">
                        <span class="step_user_text">Отмеченные события отображаются в календаре вашего телефона</span>
                    </div>
                </div><!--
			-->
                <div class="step_container">
                    <div><img src="/landing/img/pics/bell.png" height="175px" class="step_img"></div>
                    <div class="step_text_container">
                        <div><span class="step_text">Получай уведомления</span></div>
                        <div class="otstup"><span
                                class="step_user_text">Организатор добавил событие - узнаешь об этом</span></div>
                    </div>
                </div>
            </section>
        </article>

        <article class="article_content_container">
            <section>
                <div><span class="content_text_header">Кто использует Evendate?</span></div>
                <div class="line_blue_and_pink content_text_header_container"></div>
                <div>
                    <div class="who_use_container">
                        <div>
                            <a href="users.php" class="who_use_head_blue for_users_hover">Пользователи <i
                                    class="fa fa-angle-right"></i></a>
                        </div>
                        <div class="who_use_text_container"><span class="who_use_text">Собери при помощи Evendate любимые места вместе, отмечай интересные события
и получай уведомления, чтобы ничего не пропустить.</span></div>
                    </div>
                    <div class="who_use_container">
                        <div>
                            <a href="organizations.php" class="who_use_head_pink who_use_head_blue for_org_hover">Организаторы
                                <i class="fa fa-angle-right"></i></a>
                        </div>
                        <div class="who_use_text_container"><span class="who_use_text">Привлекайте и удерживайте целевую аудиторию. Размещайте события, находите потенциальных клиентов, общайтесь с участниками,  получайте аналитику по проведенным мероприятиям.</span>
                        </div>
                    </div>
                </div>
                <div class="line_blue_and_pink"></div>
            </section>

            <section class="bottom_part_content">
                <div class="phones_img_container"><img src="/landing/img/phones.jpg" class="phones_img_style"></div>
                <div class="bottom_content_container">
                    <div class="content_text_header_container_phones"><span class="content_text_header">Все события Москвы в твоём телефоне</span>
                    </div>
                    <div class="bottom_content_text_container"><span class="who_use_text">Используй мобильное приложение Evendate, чтобы не пропустить то, что тебе интересно. Афиша выставок, музеев, кинотеатров, концертов, мастер-классов в твоем кармане.</span>
                    </div>
                    <div><a href="https://itunes.apple.com/us/app/evendate/id1044975200?l=ru&ls=1&mt=8"
                            class="download_container"><img src="/landing/img/app_store.png" class="download_img"></a><a
                            href="https://play.google.com/store/apps/details?id=ru.evendate.android"
                            class="download_container"><img src="/landing/img/google_play.png" class="download_img"></a>
                    </div>
                </div>
            </section>
        </article>


        <article>
            <div class="bottom_article_and_footer_size">

                <footer>
                    <div class="line_blue_and_pink"></div>
                    <div class="footer_text_left">
                        <div class="footer_text_container"><a href="contacts.php#contacts"
                                                              class="footer_text">КОНТАКТЫ</a></div>
                        <div class="footer_text_container"><a href="about.php#organizers" class="footer_text"
                                                              id="org_footer">РАЗРАБОТЧИКАМ</a></div>
                        <div class="footer_text_container"><a href="contacts.php#support"
                                                              class="footer_text">ПОДДЕРЖКА</a></div>
                    </div>
                    <div class="footer_text_container footer_text_container_sign"><span class="footer_text_sign">Evendate © 2016</span>
                    </div>
                </footer>
            </div>
        </article>


        <div id="modal_form" class="modal_form"><!-- Сaмo oкнo -->
            <div class="top_part_modal"> <!-- Верхняя часть модалки -->
                <div class="top_part_enter"><span class="modal_top_header_text">ВХОД</span></div>
                <div><img src="/landing/img/close.png" id="modal_close" class="modal_close"><!-- Кнoпкa зaкрыть -->
                </div>
            </div> <!-- /Верхняя часть модалки -->
            <div class="bot_part_modal"> <!-- Нижняя часть модалки -->
                <div><span class="modal_bot_header_text">ВОЙДИТЕ ЧЕРЕЗ СОЦИАЛЬНУЮ СЕТЬ</span></div>
                <div class="bot_part_modal"> <!-- картинки -->
                    <div id="vk_login_in_modal" class="modal_img_container"><img src="/landing/img/VKBig.png"
                                                                                 class="modal_img" data-type="vk"></div>
                    <div id="fb_login_in_modal" class="modal_img_container"><img src="/landing/img/FBBig.png"
                                                                                 class="modal_img" data-type="facebook">
                    </div>
                    <div id="g_login_in_modal" class="modal_img_container"><img src="/landing/img/G+Big.png"
                                                                                class="modal_img" data-type="google">
                    </div>
                </div> <!-- /картинки -->
            </div> <!-- /Нижняя часть модалки -->
        </div>
        <div id="modal_form_login" class="modal_form"><!-- oкнo с загрузкой -->
            <div><img src="/landing/img/close.png" id="modal_close_login"><!-- Кнoпкa зaкрыть --></div>
            <iframe width="600" height="440"></iframe>
        </div>
        <div id="overlay" class="overlay"></div><!-- Пoдлoжкa -->

    </div>

<?php
require_once('landing/footer.php');
?>