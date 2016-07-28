<?php
$title = 'Контакты';
require_once('landing/header.php'); ?>
<body>
<header class="header_evendate">
	<div class="logo -v_centering">
		<a class="logo_link" title="Перейти на главную" href="index.php">
			<svg width="135px" height="24.70001" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 24.70001">
				<title>logo</title>
				<path id="evendate_logo_text"  transform="translate(-2.375 -0.69998)" fill="#fff" d="M18.675,16.4c0-5.3-3-8.5-8.1-8.5a8.42015,8.42015,0,0,0-8.2,8.7,8.38058,8.38058,0,0,0,8.5,8.8,7.55515,7.55515,0,0,0,7.5-5.2l-3.7-1.2a3.57051,3.57051,0,0,1-3.7,2.5,3.98288,3.98288,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,18.675,16.4Zm-11.8-1.6a3.55717,3.55717,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Zm24.3-6.3-3.9,11-4.1-11h-4.9l6.7,16.4h4.4l6.5-16.4h-4.7Zm20.6,7.9c0-5.3-3-8.5-8.1-8.5a8.25038,8.25038,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55522,7.55522,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98293,3.98293,0,0,1-4.1-3.7h11.7A13.79661,13.79661,0,0,0,51.775,16.4Zm-11.7-1.6a3.55712,3.55712,0,0,1,3.7-3.2,3.36289,3.36289,0,0,1,3.7,3.2h-7.4ZM62.975,8a5.385,5.385,0,0,0-4.7,2.5v-2h-4.3V24.9h4.4V15.4c0-1.9,1.1-3.4,3.1-3.4,2.1,0,3,1.4,3,3.3v9.6h4.4V14.5C68.875,10.9,66.975,8,62.975,8Zm24.8,13.9V0.7h-4.4v9.4c-0.5-.9-1.8-2-4.6-2-4.6,0-7.9,3.8-7.9,8.6,0,5,3.3,8.6,8,8.6a5.101,5.101,0,0,0,4.6-2.3,7.75394,7.75394,0,0,0,.2,1.9h4.2A26.28237,26.28237,0,0,1,87.775,21.9Zm-8.3-.6c-2.4,0-4.1-1.8-4.1-4.7s1.8-4.6,4.1-4.6,4,1.6,4,4.6S81.675,21.3,79.475,21.3Zm25.2,1V14.2c0-3.3-1.9-6.2-7.1-6.2-4.4,0-6.8,2.8-7,5.4l3.9,0.8a2.92541,2.92541,0,0,1,3.1-2.7c1.9,0,2.8,1,2.8,2.1a1.19858,1.19858,0,0,1-1.2,1.2l-4,.6c-2.8.4-5,2-5,5,0,2.6,2.1,4.9,5.6,4.9a5.40058,5.40058,0,0,0,4.8-2.4,12.30577,12.30577,0,0,0,.2,2h4.1A18.36784,18.36784,0,0,1,104.675,22.3Zm-4.3-4.2c0,3-1.8,3.9-3.6,3.9a1.89565,1.89565,0,0,1-2.1-1.9,2.094,2.094,0,0,1,2-2.1l3.7-.6v0.7Zm16.3-5.8V8.5h-3.3V3.6h-4.1V5.9a2.33883,2.33883,0,0,1-2.5,2.6h-0.8v3.9h3V20c0,3.2,2,5.1,5.2,5.1a5.9567,5.9567,0,0,0,2.5-.4V21a4.92317,4.92317,0,0,1-1.4.1,1.61828,1.61828,0,0,1-1.9-1.9V12.3h3.3Zm17.2,4.1a10.91279,10.91279,0,0,0-.47-3.3h-0.03a5.49026,5.49026,0,0,1-5.47-4.98,9.60458,9.60458,0,0,0-2.13-.22,8.25043,8.25043,0,0,0-8.1,8.6,8.38058,8.38058,0,0,0,8.5,8.8,7.55517,7.55517,0,0,0,7.5-5.2l-3.8-1.1a3.57051,3.57051,0,0,1-3.7,2.5,3.98284,3.98284,0,0,1-4.1-3.7h11.7A13.80487,13.80487,0,0,0,133.875,16.4Zm-11.7-1.6a3.55721,3.55721,0,0,1,3.7-3.2,3.363,3.363,0,0,1,3.7,3.2h-7.4Z"></path>
				<circle id="evendate_logo_dot" cx="131" cy="6.90002" r="4" fill="#f82969"></circle>
			</svg>
			<img class="float_logo"  width="135px" height="24.70001" src="/app/img/brand_white.png">
		</a>
	</div>
	<div class="menu_all_item_container">
		<div class="menu_item_container menu_item_container_2"><a href="index.php" class="menu_item_text">ГЛАВНАЯ</a></div>
		<div class="menu_item_container"><a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛЯМ</a></div>
		<div class="menu_item_container "><a href="organizations.php" class="menu_item_text">ОРГАНИЗАТОРАМ</a></div>
		<div class="menu_item_container "><a href="about.php#about" class="menu_item_text">О НАС</a></div>
	</div>
	<div class="header_button_container">
		<button id="go" class="header_button" type="button"><span class="header_button_text">ВОЙТИ</span></button>
	</div>
</header>

<div class="position_main_part">
<div style="background-image: url(landing/img/Support.jpg);" class="fon_img_main_page"></div>

<article class="article_fon_about_us">
	<section class="section_about_us_size">
		<div id="contacts_menu" class="about_us_menu_item">
			<div class="about_us_item"><span class="about_us_text_header about_us_text_header_active" id="contacts_page">КОНТАКТЫ</span></div><div class="contacts_item"><a href="contacts.php#support" class="about_us_text_header" id="support_page">ПОДДЕРЖКА</a></div>
		</div>
		<div class="line_blue_and_pink"></div>


		<div id="contacts_and_sup_slider" class="contacts_container">
		<div id="wrapper_contacts" class="wrapper_contacts">
				<div>
					<div class="contacts_text_container"><span class="who_use_text">Evendate - платформа для публикации событий, позволяющий любому пользователю найти интересующие его мероприятия
					и следить за организациями, которые формируют ленту. <br><br><br> Адрес: г. Москва <br><br>

Телефон для связи: +7 (495) 641-61-05
<br><br>
Электронная почта: support@evendate.ru
</span></div><div class="contacts_download_container"><div class="contacts_download"><a href="https://new.vk.com/evendate"><div class="network_icon"><i class="fa fa-vk icon network_text_vk" aria-hidden="true"></i></div><div class="network_icon"><span class="network_text network_text_vk">Мы в VKontakte</span></div></a></div>
					<div class="contacts_download"><a href="https://www.instagram.com/evendate.ru/"><div class="network_icon"><i class="fa fa-instagram icon network_text_inst" aria-hidden="true"></i></div><div class="network_icon"><span class="network_text network_text_inst">Мы в Instagram</span></div></a></div>
					<div class="contacts_download"><a href="https://twitter.com/evendate"><div class="network_icon"><i class="fa fa-twitter icon network_text_twitter" aria-hidden="true"></i></div><div class="network_icon"><span class="network_text network_text_twitter">Мы в twitter</span></div></a></div></div></div>
		</div><div id="wrapper_support" class="wrapper_contacts">
				<div>
					<div class="support_content_container"><span class="who_use_text">Остались вопросы?
<br><br>
Заполните форму, и наша команда обязательно свяжется с Вами!
</span></div>
					<form class="form_support">
						<div class="field_container"><input name="full_name" type="text" placeholder="ВАШЕ ИМЯ" required class="form_style"></div>
						<div class="field_container"><input name="email" type="email" placeholder="E-MAIL" required class="form_style"></div>
						<div class="field_container field_container_question"><textarea name="question" placeholder="СООБЩЕНИЕ" required class="form_style form_style_message"></textarea></div>
						<div class="button_fon_img_users_container_form"><button id="send_form" class="button_fon_img_users" type="button"><span class="text_button_users_top">ОТПРАВИТЬ</span></button></div>
					</form>
				</div>
		</div>
		</div>


	</section>
	<footer class="bottom_article_and_footer_size">
		<div class="line_blue_and_pink"></div>
		<div class="footer_text_left">
			<div class="footer_text_container"><span class="footer_text footer_text_active" id="contacts_footer">КОНТАКТЫ</span></div><div class="footer_text_container"><a href="about.php#organizers" class="footer_text" id="org_footer">РАЗРАБОТЧИКАМ</a></div><div class="footer_text_container"><span class="footer_text" id="support_footer">ПОДДЕРЖКА</span></div>
		</div><div class="footer_text_container footer_text_container_sign"><span class="footer_text_sign">Evendate © 2016</span></div>
	</footer>

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