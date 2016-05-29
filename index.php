<?php
require_once 'v1-backend/bin/db.php';
require_once 'v1-backend/bin/Class.Result.php';
require_once 'v1-backend/users/Class.AbstractUser.php';
require_once 'v1-backend/users/Class.User.php';
require_once 'v1-backend/tags/Class.TagsCollection.php';
try{
	$user = new User($__db);
	if (isset($_GET['logout']) && $_GET['logout'] == true){
		$user->logout();
	}else{
		header('Location: /timeline');
		die();
	}
}catch(Exception $e){
	if (!isset($_GET['force_web'])){
		$useragent = $_SERVER['HTTP_USER_AGENT'];

		if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4)))
			header('Location: /mobile');
	}
}
$title = 'Evendate';
require_once('landing/header.php');
?>
	<body>
	<header class="header_evendate"><div class="logo"><a title="Перейти на главную" href="index.php"><img src="/landing/img/logo_500.png" class="logo_size"><div class="logo_text_style_container"><span class="logo_text_style">Evendate</span></div></a></div><div class="menu_all_item_container">
		<div class="menu_item_container"><span class="menu_item_text menu_item_container_active">ГЛАВНАЯ</span><div class="header_menu_line"></div></div><div class="menu_item_container "><a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛЯМ</a></div><div class="menu_item_container "><a href="organizations.php" class="menu_item_text">ОРГАНИЗАТОРАМ</a></div><div class="menu_item_container "><a href="about.php#about" class="menu_item_text">О НАС</a></div>
	</div><div class="header_button_container"><button id="go" class="header_button" type="button"><span class="header_button_text">ВОЙТИ</span></button></div></header>


	<div class="position_main_part">
	<div class="fon_img_main_page fon_img_mane_mini">
		<div class="position_in_fon">
		<div class="fon_text_container">
			<div><span class="fon_text_top">Попробуй сделать свою жизнь интереснее!</span></div>
			<div class="fon_text_bottom_container"><span class="fon_text_bottom">Evendate - это сервис для быстрого и удобного поиска интересных мероприятий.</span></div>

		</div><div class="login_container"><div class="login_container_text"><span class="login_text">ВОЙТИ С ПОМОЩЬЮ</span></div>
		<div><div class="login_img_container"><img src="/landing/img/vk_logo.jpg" id="vk_login" class="img_login" data-type="vk"></div><div class="login_img_container"><img src="/landing/img/fb_logo.jpg" id="fb_login" class="img_login" data-type="facebook"></div><div class="login_img_container"><img src="/landing/img/g+_logo.png" id="g_login" class="img_login" data-type="google"></div></div>
		<div ><button class="login_button"><span class="login_button_text">ВОЙТИ БЕЗ АВТОРИЗАЦИИ</span></button></div>
	</div>
	</div>
		</div>

	<article class="fon_article">
		<section class="section_stay_in_touch">
			<div><span class="section_stay_in_touch_text_top">Будь в курсе событий!</span></div>
			<div class="section_stay_in_touch_text_bottom_container"><span class="section_stay_in_touch_text_bottom">Подпишись на интересующие тебя источники, сформируй уникальную ленту новостей и с легкостью отслеживай события, которые происходят вокруг тебя!</span></div>
		</section>
		<section class="section_steps">
			<div class="step_container"><div><img src="/landing/img/subscribe.png" class="step_img"></div><div class="step_text_container"><span class="step_text">ПОДПИСЫВАЙСЯ НА ОРГАНИЗАТОРОВ</span></div></div><div class="step_container step_container_center"><div><img src="/landing/img/Liked.png" class="step_img"></div><div class="step_text_container"><span class="step_text">ДОБАВЛЯЙ СОБЫТИЯ В ИЗБРАННОЕ</span></div></div><div class="step_container"><div><img src="/landing/img/notice.png" class="step_img"></div><div class="step_text_container"><span class="step_text">ПОЛУЧАЙ УВЕДОМЛЕНИЯ</span></div></div>
		</section>
	</article>

	<article class="article_content_container">
		<section>
			<div><span class="content_text_header">Кто использует Evendate?</span></div>
			<div class="line_blue_and_pink content_text_header_container"></div>
			<div>
				<div class="who_use_container"><div><a href="users.php" class="who_use_head_blue for_users_hover">ПОЛЬЗОВАТЕЛИ<img src="/landing/img/BlueArrow.png" class="arrow_img"></a></div>
				<div class="who_use_text_container"><span class="who_use_text">Все мероприятия Москвы в одном простом и удобном сервисе.  Используя Evendate, ты
				сможешь собрать все любимые места в собственную персонализированную ленту.</span></div></div><div class="who_use_container"><div><a href="organizations.php" class="who_use_head_pink who_use_head_blue for_org_hover">ОРГАНИЗАТОРЫ<img src="/landing/img/PinkArrow.png" class="arrow_img"></a></div>
				<div class="who_use_text_container"><span class="who_use_text">Evendate - самый простой способ привлечь и удержать нужную аудиторию. Мы предлагаем не только потенциальных клиентов, но и
				возможность получения статистики проведенных событий.</span></div></div>
			</div>
			<div class="line_blue_and_pink"></div>
		</section>

		<section class="bottom_part_content">
			<div class="phones_img_container"><img src="/landing/img/phones.jpg" class="phones_img_style"></div><div class="bottom_content_container">
			<div class="content_text_header_container_phones"><span class="content_text_header">Все события Москвы в твоём телефоне</span></div>
		<div class="bottom_content_text_container"><span class="who_use_text">Используй мобильное приложение Evendate, чтобы не пропустить то, что тебе интересно.
Афиша выставок, музеев, кинотеатров, концертов, мастер-классов всегда под рукой.</span></div>
		<div><a href="https://itunes.apple.com/us/app/evendate/id1044975200?l=ru&ls=1&mt=8" class="download_container"><img src="/landing/img/app_store.png" class="download_img"></a><a href="https://play.google.com/store/apps/details?id=ru.evendate.android" class="download_container"><img src="/landing/img/google_play.png" class="download_img"></a></div></div>
		</section>
	</article>

	<article class="bottom_article_and_footer">
		<div class="bottom_article_and_footer_size">
		<section class="who_us_container">
			<div><span class="content_text_header">Кто мы</span></div>
			<div class="who_us_text_container"><span class="who_us_text">Мы команда из Государственного Университета Управления, которая решила объединить все мероприятия Москвы в одном удобном сервисе.
					 Пользуясь нашим приложением, вы всегда будете в курсе интересных событий и никогда их не пропустите.</span></div>
		</section>
		<footer>
			<div class="line_blue_and_pink"></div>
			<div class="footer_text_left">
				<div class="footer_text_container"><a href="contacts.php#contacts" class="footer_text">КОНТАКТЫ</a></div><div class="footer_text_container"><a href="about.php#organizers" class="footer_text" id="org_footer">РАЗРАБОТЧИКАМ</a></div><div class="footer_text_container"><a href="contacts.php#support" class="footer_text">ПОДДЕРЖКА</a></div>
			</div><div class="footer_text_container footer_text_container_sign"><span class="footer_text_sign">Evendate © 2016</span></div>
		</footer>
			</div>
	</article>

	<div id="modal_form" class="modal_form"><!-- Сaмo oкнo -->
		<div class="top_part_modal"> <!-- Верхняя часть модалки -->
			<div class="top_part_enter"><span class="modal_top_header_text">ВХОД</span></div><div><img src="/landing/img/close.png" id="modal_close" class="modal_close"><!-- Кнoпкa зaкрыть --></div>
		</div> <!-- /Верхняя часть модалки -->
		<div class="bot_part_modal"> <!-- Нижняя часть модалки -->
			<div><span class="modal_bot_header_text">ВОЙДИТЕ ЧЕРЕЗ СОЦИАЛЬНУЮ СЕТЬ</span></div>
			<div class="bot_part_modal"> <!-- картинки -->
				<div id="vk_login_in_modal" class="modal_img_container"><img src="/landing/img/VKBig.png" class="modal_img" data-type="vk"></div>
				<div id="fb_login_in_modal" class="modal_img_container"><img src="/landing/img/FBBig.png" class="modal_img" data-type="facebook"></div>
				<div id="g_login_in_modal" class="modal_img_container"><img src="/landing/img/G+Big.png" class="modal_img" data-type="google"></div>
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