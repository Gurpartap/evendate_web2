<?php
$title = 'Контакты';
require_once('landing/header.php'); ?>
<body>
<header class="header_evendate"><div class="logo"><a title="Перейти на главную" href="index.php"><img src="/landing/img/logo_500.png" class="logo_size"><div class="logo_text_style_container"><span class="logo_text_style">Evendate</span></div></a></div><div class="menu_all_item_container">
	<div class="menu_item_container menu_item_container_2"><a href="index.php" class="menu_item_text">ГЛАВНАЯ</a></div><div class="menu_item_container"><a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛЯМ</a></div><div class="menu_item_container "><a href="organizations.php" class="menu_item_text">ОРГАНИЗАТОРАМ</a></div><div class="menu_item_container "><a href="about.php#about" class="menu_item_text">О НАС</a></div>
</div><div class="header_button_container"><button id="go" class="header_button" type="button"><span class="header_button_text">ВОЙТИ</span></button></div></header>

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