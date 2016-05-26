/**
 * Created by Ann on 21.05.2016.
 */

function modalOpen(event){
	$('#overlay.overlay').fadeIn(400, // show overlay
		function(){
			$('#modal_form.modal_form')
				.css('display', 'block') // show modal window
				.animate({opacity: 1, top: '50%'}, 200); // change opacity 1
		});
}

function modalClose(){ // catch click in X or overlay
	$('#modal_form.modal_form')
		.animate({opacity: 0, top: '45%'}, 200,  // change opacity 0 and move modal window up
			function(){ 
				$(this).css('display', 'none');
				$('#overlay.overlay').fadeOut(400); // hide overlay
			}
		);
}

$(document).ready(function() {
	var closers = $('#modalClose, #overlay');
	$('button#go').on('click', modalOpen);
	/* Close modal, in reverse order */
	closers.on('click', modalClose);
	$('button#gogo').on('click', modalOpen);
	closers.on('click', modalClose);
});

function modalOpenLogin(event) {
    debugger; //catch bugs
    openAuthLink($(event.target).data('type'));
    event.preventDefault();
    $('#modal_form').css('display', 'none');
    $('#modal_form_login')
        .css('display', 'block')
        .animate({opacity: 1, top: '50%'}, 200);
    openAuthLink($(event.target).data('type'));
}

function modalOpenLoginOutButton(event){
	$('#overlay.overlay').fadeIn(400, // show overlay
		function(){
			$('#modal_form_login')
				.css('display', 'block') // show modal window
				.animate({opacity: 1, top: '50%'}, 200); // change opacity 1
		});
}

function modalCloseLogin(){ // catch click in X or overlay
	$('#modal_form_login')
		.animate({opacity: 0, top: '45%'}, 200,  // change opacity 0 and move modal window up
			function(){ // пoсле aнимaции
				$(this).css('display', 'none');
				$('#overlay.overlay').fadeOut(400); // hide overlay
			}
		);
}

$(document).ready(function() { // modal window vk
	var closers_login = $('#modalCloseLogin, #overlay');
	$('#vk_login').on('click', modalOpenLoginOutButton);
	closers_login.on('click', modalCloseLogin);

	$('#fb_login').on('click', modalOpenLoginOutButton); //fb
	closers_login.on('click', modalCloseLogin);

	$('#g_login').on('click', modalOpenLoginOutButton); //g+
	closers_login.on('click', modalCloseLogin);

	$('#vk_login_in_modal').on('click', modalClose, modalOpenLogin);
	closers_login.on('click', modalCloseLogin);

	$('#fb_login_in_modal').on('click', modalClose, modalOpenLogin);
	closers_login.on('click', modalCloseLogin);
	$('#g_login_in_modal').on('click', modalClose, modalOpenLogin);
	closers_login.on('click', modalCloseLogin);
});

var o = $(window);
 $(".mask-loading").css("height", '50px');
 $(".spinner").css("top", '50% - 50px' );