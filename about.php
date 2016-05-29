<?php
$title = 'О нас';
require_once('landing/header.php'); ?>
<body>
<header class="header_evendate"><div class="logo"><a title="Перейти на главную" href="index.php"><img src="/landing/img/logo_500.png" class="logo_size"><div class="logo_text_style_container"><span class="logo_text_style">Evendate</span></div></a></div><div class="menu_all_item_container">
	<div class="menu_item_container"><a href="index.php" class="menu_item_text">ГЛАВНАЯ</a></div><div class="menu_item_container"><a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛЯМ</a></div><div class="menu_item_container "><a href="organizations.php" class="menu_item_text">ОРГАНИЗАТОРАМ</a></div><div class="menu_item_container "><span class="menu_item_text menu_item_container_active">О НАС</span><div class="header_menu_line"></div></div>
</div><div class="header_button_container"><button id="go" class="header_button" type="button"><span class="header_button_text">ВОЙТИ</span></button></div></header>

<div class="position_main_part">
<div class="fon_img_users"></div> <!-- Картинка -->

<article class="article_fon_about_us"> <!-- Серый фон -->
	<section class="section_about_us_size"> <!-- 1008px -->
		<div class="about_us_menu_item">
			<div class="about_us_item"><span id="about_evendate" class="about_us_text_header about_us_text_header_active">О EVENDATE</span></div><div class="about_us_item"><span id="team_page" class="about_us_text_header">НАША КОМАНДА</span></div><div class="about_us_item"><span id="organizers_page" class="about_us_text_header">РАЗРАБОТЧИКАМ</span></div>
		</div>
		<div class="line_blue_and_pink"></div>


		<div id="about_us_content_container" class="about_us_content_container">
		<div id="wrapper_about_us_1" class="wrapper_contacts_about_us">
		<div>
			<div>
				<div class="about_us_content_text_container"><span class="who_use_text">Около года назад мы решили объединить все мероприятия Москвы в одном простом и удобном сервисе, где в соответствии с личными интересами можно подписаться на организаторов, добавлять их мероприятия себе в календарь, получать напоминания,
				чтобы ничего не пропустить, а также видеть какие мероприятия посещают друзья.</span></div><div class="about_us_content_text_container"><span class="who_use_text">Итогом нашей работы стал сервис, представленный в виде веб-сайта, iOS- и Android-приложений.
			Теперь есть возможность быть в курсе всех интересных вам событий - в родном городе, в любимой организации, в альма-матер, в любом другом месте.</span></div></div>
		</div>
		<!-- мы в соц сетях -->
		<div class="all_network_container">
			<div class="network_container"><a href="https://twitter.com/evendate"><div class="network_icon"><i class="fa fa-twitter icon network_text_twitter" aria-hidden="true"></i></div><div class="network_icon"><span class="network_text network_text_twitter">Мы в twitter</span></div></a></div>
			<div class="network_container"><a href="https://new.vk.com/evendate"><div class="network_icon"><i class="fa fa-vk icon network_text_vk" aria-hidden="true"></i></div><div class="network_icon"><span class="network_text network_text_vk">Мы в VKontakte</span></div></a></div>
			<div class="network_container"><a href="https://www.instagram.com/evendate.ru/"><div class="network_icon"><i class="fa fa-instagram icon network_text_inst" aria-hidden="true"></i></div><div class="network_icon"><span class="network_text network_text_inst">Мы в Instagram</span></div></a></div>
		</div>
		<!-- /мы в соц сетях -->
		</div><div id="wrapper_about_us_2" class="wrapper_contacts_about_us">
			<div class="team_all_photo_container">
			<div><span class="who_use_text">Мы используем Evendate ежедневно, им пользуются наши друзья и друзья друзей. Мы будем рады видеть вас в числе наших пользователей.
								 Верим, что вы полюбите Evendate - он упростит вам жизнь. Скачивайте и пробуйте!</span></div>
			<div class="team_text_container"><span class="who_use_text">Знакомьтесь с командой, которая это все создает</span></div>

			<div class="photos_container">
				<div class="team_photo_container" style="background-image: url(/landing/img/team_1.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Инал Карданов</span><div><span class="team_name_text">Lead Backend Delevoper</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_2.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Арам Харазян</span><div><span class="team_name_text">Lead Frontend Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_3.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Дмитрий Гордеев</span><div><span class="team_name_text">Lead Android Delevoper</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_4.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Денис Оздемир</span><div><span class="team_name_text">Lead Product Designer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_5.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Амир Абдуллаев</span><div><span class="team_name_text">Investor & Public Relations</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_6.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Александр Сапронов</span><div><span class="team_name_text">Designer</span></div></div></div></div>
			</div>

			<div class="photos_container">
				<div class="team_photo_container" style="background-image: url(/landing/img/team_8.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Регина Лукьянова</span><div><span class="team_name_text">UX/UI</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_9.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Елена Власова </span><div><span class="team_name_text">UX/UI</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_10.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Анна Андрианова</span><div><span class="team_name_text">Frontend Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_11.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Елена Каминская</span><div><span class="team_name_text">Analyst</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_7.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Ольга Санникова</span><div><span class="team_name_text">Sales manager</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_12.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Александра Серкова</span><div><span class="team_name_text">Sales manager</span></div></div></div></div>
			</div>

			<div class="photos_container">
					<div class="team_photo_container" style="background-image: url(/landing/img/team_13.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Савр Манджиев</span><div><span class="team_name_text">Backend Delevoper</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_15.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Анна Литвинова</span><div><span class="team_name_text">Node.js Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_20.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Али Абдулмаджидов</span><div><span class="team_name_text">Android developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_21.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Айта Манджиев</span><div><span class="team_name_text">Android developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_14.jpg); background-size: 158px;">
					<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Кристина Личинина</span><div><span class="team_name_text">Junior Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_16.jpg); background-size: 158px;">
					<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Катя Мысливцева</span><div><span class="team_name_text">Junior Developer</span></div></div></div></div>
			</div>

				<div class="photos_container">
					<div class="team_photo_container" style="background-image: url(/landing/img/team_22.jpg); background-size: 158px;">
						<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Ерлан Тансыкбаев</span><div><span class="team_name_text">Sales manager</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_17.jpg); background-size: 158px;">
						<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Анастасия Лукьянова</span><div><span class="team_name_text">Content manager</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team_18.jpg); background-size: 158px;">
					<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Дарина Кириенко</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
					<div class="team_photo_container" style="background-image: url(/landing/img/team_19.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Татьяна Иванова</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
					<div class="team_photo_container" style="background-image: none; background-size: 158px;"><div class="team_name_fon" style="display: none"><div class="team_name_container"><span class="team_first_name_text">Татьяна Иванова</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
					<div class="team_photo_container" style="background-image: none; background-size: 158px;"><div class="team_name_fon" style="display: none"><div class="team_name_container"><span class="team_first_name_text">Татьяна Иванова</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
				</div>
			</div>
			</div><div id="wrapper_about_us_3" class="wrapper_contacts_about_us">
			<div class="team_all_photo_container">
				<div><span class="who_use_text">Наши разработчики ежедневно дорабатывают продукт, чтобы сделать сервис интереснее.
Если вы хотите приобщиться к нашей миссии и сделать Evendate чуточку лучше,
то мы предлагаем воспользоваться нашим Beta REST API.
<br><br>
Заполните форму, и наша команда обязательно свяжется с Вами!</span></div>
			</div>
			<form class="form_support">
				<div class="field_container"><input name="full_name" type="text" placeholder="ВАШЕ ИМЯ" required class="form_style"></div>
				<div class="field_container"><input name="email" type="email" placeholder="E-MAIL" required class="form_style"></div>
				<div class="field_container field_container_question"><textarea name="message" placeholder="СООБЩЕНИЕ" required class="form_style form_style_message"></textarea></div>
				<div class="button_fon_img_users_container_form"><button id="send_form" class="button_fon_img_users" type="button"><span class="text_button_users_top">ОТПРАВИТЬ</span></button></div>
			</form>
		</div>
		</div>

		</section>


			<footer class="bottom_article_and_footer_size">
		<div class="line_blue_and_pink"></div>
		<div class="footer_text_left">
			<div class="footer_text_container"><a href="contacts.php#contacts" class="footer_text">КОНТАКТЫ</a></div><div class="footer_text_container"><span id="organizers_footer" class="footer_text">РАЗРАБОТЧИКАМ</span></div><div class="footer_text_container"><a href="contacts.php#support" class="footer_text">ПОДДЕРЖКА</a></div>
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