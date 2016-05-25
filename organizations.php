<?php
$title = 'Организаторам';
require_once('landing/header.php'); ?>
	<body>
	<header class="header_evendate"><div class="logo"><a title="Перейти на главную" href="index.php"><img src="/landing/img/logo_500.png" class="logo_size"><div class="logo_text_style_container"><span class="logo_text_style">Evendate</span></div></a></div><div class="menu_all_item_container">
			<div class="menu_item_container"><a href="index.php" class="menu_item_text">ГЛАВНАЯ</a></div><div class="menu_item_container"><a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛИ</a></div><div class="menu_item_container "><span class="menu_item_text menu_item_container_active">ОРГАНИЗАТОРАМ</span><div class="header_menu_line"></div></div><div class="menu_item_container "><a href="about.php#about" class="menu_item_text">О НАС</a></div>
		</div><div class="header_button_container"><button id="go" class="header_button"><span class="header_button_text">ВОЙТИ</span></button></div></header>

	<div class="position_main_part">
		<div class="fon_img_main_page org_mini">
			<div class="position_in_fon">
				<div class="fon_users_text_container_org">
					<div><span class="fon_text_top">Присоединяйтесь к нам!</span></div>
					<div class="fon_text_bottom_container"><span class="fon_text_bottom">Evendate - для организаторов, кому нужно информировать о событии и анализировать отдачу.</span></div>
					<div>
						<div id="join_button" class="button_fon_img_users_container_org"><button class="button_fon_img_users"><span class="text_button_users_top">ПРИСОЕДИНИТЬСЯ</span></button></div>
						<a href="contacts.php#support" class="button_fon_img_users_container_org"><button class="button_fon_img_users button_fon_img_users_bot_users"><span class="text_button_users_bottom">ЗАДАТЬ ВОПРОС</span></button></a>
					</div>
				</div>
			</div>
		</div>


		<article class="article_fon_users">
			<section class="section_stay_in_touch">
				<div><span class="section_stay_in_touch_text_top">Что мы предлагаем?</span></div>
				<div class="section_stay_in_touch_text_bottom_container"><span class="section_stay_in_touch_text_bottom">Наше приложение позволяет публиковывать мероприятия, оповещать о них, создавать аудиторию, следить за конкурентами, а также помагает в планировании.</span></div>
			</section>
			<section class="fon_users_section">

				<div class="steps_user_container">
					<div class="step_user_container"><img src="/landing/img/9999.png" class="step_user_img"></div><div class="user_step_content_container">
						<div><span class="step_text">ПЛОЩАДКА ДЛЯ СОБЫТИЙ</span></div>
						<div class="step_user_text_bot_container"><span class="step_user_text">EVENDATE ПОЗВОЛЯЕТ БЫСТРО И УДОБНО ДОБАВЛЯТЬ СОБЫТИЯ. НАШ СЕРВИС ПРЕДОСТАВЛЯЕТ ВОЗМОЖНОСТЬ ИСПОЛЬЗОВАНИЯ КРОССПОСТИНГА.</span></div>
					</div>
				</div>
				<div class="line_blue_and_pink"></div>

				<div class="steps_user_container">
					<div class="user_step_content_container user_step_content_container_2">
						<div><span class="step_text">АУДИТОРИЯ</span></div>
						<div class="step_user_text_bot_container"><span class="step_user_text">EVENDATE - САМЫЙ ПРОСТОЙ СПОСОБ ПРИВЛЕЧЬ И УДЕРЖАТЬ НУЖНУЮ АУДИТОРИЮ.
НАШИМ ПРИЛОЖЕНИЕМ ПОЛЬЗУЮТСЯ ТЫСЯЧИ СТУДЕТНОВ МОСКВЫ.</span></div>
					</div><div class="step_user_container_2"><img src="/landing/img/1010.png" class="step_user_img"></div>
				</div>
				<div class="line_blue_and_pink"></div>

				<div class="steps_user_container">
					<div class="step_user_container"><img src="/landing/img/1212.png" class="step_user_img"></div><div class="user_step_content_container">
						<div><span class="step_text">СТАТИСТИКА И АНАЛИТИКА</span></div>
						<div class="step_user_text_bot_container"><span class="step_user_text">ВОЗМОЖНОСТИ EVENDATE ОБШИРНЫ - ВЫ, КАК ОРГАНИЗАТОР, ВСЕГДА СМОЖЕТЕ ПОЛУЧИТЬ СТАТИСТИКУ ПРОВЕДЕННЫХ СОБЫТИЙ И АНАЛИЗИРОВАТЬ ПОЛУЧЕННЫЕ ДАННЫЕ. </span></div>
					</div>
				</div>
			</section>
		</article>

		<article id="join_form" class="blank_article_container">
			<section class="join_org_container"><span class="content_text_header">Присоединяйтесь к организациям, которые уже работают с нами.</span></section>
			<form class="form_container">
				<div class="text_header_form_container"><span class="user_text_section_header user_text_section_header_bot">Заполните форму, и наша команда обязательно свяжется с Вами!</span></div>
				<div class="field_container"><input class="form_style" type="text" name="organization_name" required placeholder="НАЗВАНИЕ ОРГАНИЗАЦИИ"></div>
				<div class="field_container"><input class="form_style" type="text" name="full_name" required placeholder="ВАШЕ ИМЯ"></div>
				<div class="field_container"><input class="form_style" type="email" name="email" required placeholder="E-MAIL"></div>
				<div class="field_container field_container_question"><textarea class="form_style form_style_message" name="message" placeholder="СООБЩЕНИЕ"></textarea></div>
				<div class="button_fon_img_users_container_form"><button id="send_form" class="button_fon_img_users" type="button"><span class="text_button_users_top">ОТПРАВИТЬ</span></button></div>
			</form>

			<section>
				<footer class="bottom_article_and_footer_size">
					<div class="line_blue_and_pink"></div>
					<div class="footer_text_left">
						<div class="footer_text_container"><a href="contacts.php#contacts" class="footer_text">КОНТАКТЫ</a></div><div class="footer_text_container"><a href="about.php#organizers" class="footer_text" id="org_footer">РАЗРАБОТЧИКАМ</a></div><div class="footer_text_container"><a href="contacts.html#support" class="footer_text">ПОДДЕРЖКА</a></div>
					</div><div class="footer_text_container footer_text_container_sign"><span class="footer_text_sign">Evendate © 2016</span></div>
				</footer>
			</section>
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