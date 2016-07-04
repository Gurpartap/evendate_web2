<?php
$title = 'О нас';
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
		<div class="menu_item_container"><a href="index.php" class="menu_item_text">ГЛАВНАЯ</a></div>
		<div class="menu_item_container"><a href="users.php" class="menu_item_text">ПОЛЬЗОВАТЕЛЯМ</a></div>
		<div class="menu_item_container "><a href="organizations.php" class="menu_item_text">ОРГАНИЗАТОРАМ</a></div>
		<div class="menu_item_container "><span class="menu_item_text menu_item_container_active">О НАС</span>
			<div class="header_menu_line"></div>
		</div>
	</div>
	<div class="header_button_container">
		<button id="go" class="header_button" type="button"><span class="header_button_text">ВОЙТИ</span></button>
	</div>
</header>

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
				<div class="about_us_content_text_container"><span class="who_use_text">Год назад мы взялись за объединение мероприятий Москвы в одном сервисе, где по личными интересам можно подписаться на организаторов, добавлять мероприятия себе в календарь,
				получать напоминания, чтобы ничего не пропустить, и видеть какие мероприятия посещают друзья.</span></div><div class="about_us_content_text_container"><span class="who_use_text">Итогом работы стал сервис, представленный в виде веб-сайта, iOS- и Android-приложений. Теперь ты в курсе интересных событий – в родном городе, в любимой организации, в альма-матер, в любом другом месте.</span></div></div>
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
			<div><span class="who_use_text">Мы используем Evendate ежедневно, им пользуются наши друзья и друзья друзей. Мы будем рады видеть тебя в числе пользователей. Верим, что полюбишь Evendate – он упростит вам жизнь. Скачивайте и пробуйте!</span></div>
			<div class="team_text_container"><span class="who_use_text">Знакомьтесь с командой, которая это все создает</span></div>

			<div class="photos_container">
				<div class="team_photo_container" style="background-image: url(/landing/img/team/Inal.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Инал Карданов</span><div><span class="team_name_text">Lead Backend Delevoper</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Aram.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Арам Харазян</span><div><span class="team_name_text">Lead Frontend Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Dima.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Дмитрий Гордеев</span><div><span class="team_name_text">Lead Android Delevoper</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Denis.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Денис Оздемир</span><div><span class="team_name_text">Lead Product Designer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Amir.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Амир Абдуллаев</span><div><span class="team_name_text">Investor & Public Relations</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Sasha_A.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Александр Сапронов</span><div><span class="team_name_text">Designer</span></div></div></div></div>
			</div>

			<div class="photos_container">
				<div class="team_photo_container" style="background-image: url(/landing/img/team/Rita.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Регина Лукьянова</span><div><span class="team_name_text">UX/UI</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Elena_V.JPG); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Елена Власова </span><div><span class="team_name_text">UX/UI</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Ann_A.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Анна Андрианова</span><div><span class="team_name_text">Frontend Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Elena_K.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Елена Каминская</span><div><span class="team_name_text">Analyst</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Olya.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Ольга Санникова</span><div><span class="team_name_text">Sales manager</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Sasha_S.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Александра Серкова</span><div><span class="team_name_text">Sales manager</span></div></div></div></div>
			</div>

			<div class="photos_container">
					<div class="team_photo_container" style="background-image: url(/landing/img/team/Savr.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Савр Манджиев</span><div><span class="team_name_text">Backend Delevoper</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Ann_L.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Анна Литвинова</span><div><span class="team_name_text">Node.js Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Ali.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Али Абдулмаджидов</span><div><span class="team_name_text">Android developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Aita.jpg); background-size: 158px;">
				<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Айта Манджиев</span><div><span class="team_name_text">Android developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Kristina.jpg); background-size: 158px;">
					<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Кристина Личинина</span><div><span class="team_name_text">Junior Developer</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Kati.jpg); background-size: 158px;">
					<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Екатерина Мысливцева</span><div><span class="team_name_text">Junior Developer</span></div></div></div></div>
			</div>

				<div class="photos_container">
					<div class="team_photo_container" style="background-image: url(/landing/img/team/Erlan.jpg); background-size: 158px;">
						<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Ерлан Тансыкбаев</span><div><span class="team_name_text">Sales manager</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Stasya.jpg); background-size: 158px;">
						<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Анастасия Лукьянова</span><div><span class="team_name_text">Content manager</span></div></div></div></div><div class="team_photo_container" style="background-image: url(/landing/img/team/Darina.jpg); background-size: 158px;">
					<div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Дарина Кириенко</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
					<div class="team_photo_container" style="background-image: url(/landing/img/team/Tanya.jpg); background-size: 158px;"><div class="team_name_fon"><div class="team_name_container"><span class="team_first_name_text">Татьяна Иванова</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
					<div class="team_photo_container" style="background-image: none; background-size: 158px;"><div class="team_name_fon" style="display: none"><div class="team_name_container"><span class="team_first_name_text">Татьяна Иванова</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
					<div class="team_photo_container" style="background-image: none; background-size: 158px;"><div class="team_name_fon" style="display: none"><div class="team_name_container"><span class="team_first_name_text">Татьяна Иванова</span><div><span class="team_name_text">Content manager</span></div></div></div></div>
				</div>
			</div>
			</div><div id="wrapper_about_us_3" class="wrapper_contacts_about_us">
			<div class="team_all_photo_container">
				<div><span class="who_use_text">Наши разработчики ежедневно дорабатывают продукт, чтобы сделать сервис лучше. Приобщитесь к нашей миссии и сделайте Evendate еще круче – предлагаем воспользоваться Beta REST API.
<br><br>
Заполните форму, и мы свяжемся с вами</span></div>
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