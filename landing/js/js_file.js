function supportSlider() {
	$('#contacts_and_sup_slider').addClass('contacts_container_support').height($('#wrapper_support').height());
	$('#support_page').addClass('about_us_text_header_active');
	$('#support_footer').addClass('footer_text_active');
	$('#contacts_page').removeClass('about_us_text_header_active');
	$('#contacts_footer').removeClass('footer_text_active');
	location.hash = '#support';
}

function contacts_slider() {
	$('#contacts_and_sup_slider').removeClass('contacts_container_support').height($('#wrapper_contacts').height());
	$('#support_page').removeClass('about_us_text_header_active');
	$('#support_footer').removeClass('footer_text_active');
	$('#contacts_page').addClass('about_us_text_header_active');
	$('#contacts_footer').addClass('footer_text_active');
	location.hash = '#contacts';
}

$('#support_page').on('click', supportSlider);
$('#support_footer').on('click', supportSlider);
$('#contacts_page').on('click', contacts_slider);
$('#contacts_footer').on('click', contacts_slider);
if(location.hash == '#support'){
	supportSlider();
}
if(location.hash == '#contacts'){
	contacts_slider();
}

function teamSlider () {
	$('#team_page').addClass('about_us_text_header_active');
	$('#about_evendate').removeClass('about_us_text_header_active');
	$('#organizers_page').removeClass('about_us_text_header_active');
	$('#organizers_footer').removeClass('about_us_text_header_active');
	$('#about_us_content_container').addClass('contacts_container_support').removeClass('about_us_organizers_slider').height($('#wrapper_about_us_2').height());
	location.hash = '#team';

}

function organizersSlider () {
	$('#organizers_page').addClass('about_us_text_header_active');
	$('#organizers_footer').addClass('about_us_text_header_active');
	$('#about_evendate').removeClass('about_us_text_header_active');
	$('#team_page').removeClass('about_us_text_header_active');
	$('#about_us_content_container').addClass('about_us_organizers_slider').removeClass('about_us_page').height($('#wrapper_about_us_3').height());
	location.hash = '#organizers';
}

function aboutEvendateSlider () {
	$('#about_evendate').addClass('about_us_text_header_active');
	$('#team_page').removeClass('about_us_text_header_active');
	$('#organizers_page').removeClass('about_us_text_header_active');
	$('#about_us_content_container').removeClass('contacts_container_support').removeClass('about_us_organizers_slider').height($('#wrapper_about_us_1').height());
	location.hash = '#about';
}

$('#team_page').on('click', teamSlider);
$('#organizers_page').on('click', organizersSlider);
$('#organizers_footer').on('click', organizersSlider);
$('#about_evendate').on('click', aboutEvendateSlider);
if(location.hash == '#organizers'){
	organizersSlider();
}
if(location.hash == '#about'){
	aboutEvendateSlider();
}
if(location.hash == '#team'){
	teamSlider();
}

function joinPage () {
	$('body').animate({scrollTop: $('#join_form').position().top}, '600', 'swing');
}

$('#join_button').on('click', joinPage); // scrolling


var o = $(window);
$(".mask-loading").css("height", o.height());





function showNotifier(response){
	$.notify({
		'message': response.text,
		'pos': response.pos ? response.pos : 'top-right',
		'status': response.status ? 'success' : 'danger'
	});
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

$("#send_form").off('click').on("click", function(){
	var $form = $(this).parents("form"),
		$required = $form.find(":required"),
		is_valid = true;

	$required.each(function(i, el){
		var $this = $(el);
		if($this.is("[type='email']") && !validateEmail($this.val())){
			$this.addClass("status-error").one("input", function(){
				$(this).removeClass("status-error");
			});
			is_valid = false;
			showNotifier({text: 'Пожалуйста, введите валидный email адрес', status: false});
		} else if(!$this.val().trim()){
			$this.addClass("status-error").one("input", function(){
				$(this).removeClass("status-error");
			});
			is_valid = false;
			showNotifier({text: 'Заполнены не все обязательные поля', status: false});
		}
	});
	if(is_valid){
		$form.hide();

		var arr = $form.serializeArray(),
			data = {};

		arr.forEach(function(val){
			data[val.name] = val.value;
		});

		socket.emit('feedback', data);
		$form.after('<p>Спасибо за интерес к нашему сервису.<br>Ожидайте ответ в течение суток</p>');
	}
});