//Ultima HTML5 Landing Page v2.3
//Copyright 2014 8Guild.com
//All scripts for Ultima Landing Page version #2

/*Page Preloading*/
$(window).load(function () {
	$('#spinner').fadeOut();
	$('#preloader').delay(300).fadeOut('slow');
	setTimeout(function () {
		$('.first-slide div:first-child').addClass('fadeInDown');
	}, 100);
	setTimeout(function () {
		$('.first-slide div:last-child').addClass('fadeInRight');
	}, 100);
	setTimeout(function () {
		$('.color-switcher').addClass('slideInLeft');
	}, 100);
});

/*Checking if it's touch device we disable some functionality due to inconsistency*/
if (Modernizr.touch) {
	$('*').removeClass('animated');
}

/*Document Ready*/
$(document).ready(function (e) {
	
	
	/********Responsive Navigation**********/
	$('.navi-toggle').on('click', function () {
		$('.main-navi').toggleClass('open');
	});
	
	$('.main-navi .has-dropdown a i').click(function () {
		$(this).parent().parent().find('.dropdown').toggleClass('expanded');
		return false
	});
	
	/*Hero Slider*/
	$('.hero-slider').bxSlider({
		mode: 'fade',
		adaptiveHeight: true,
		controls: false,
		video: true,
		touchEnabled: false
	});
	
	////////////////////////////////////////////////////////////
	//INTERNAL ANCHOR LINKS SCROLLING (NAVIGATION)
	$(".scroll").click(function (event) {
		event.preventDefault();
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 80}, 1000, 'easeInOutQuart');
	});
	
	/*Scroll Up*/
	$('.scroll-up').click(function () {
		$("html, body").animate({scrollTop: 0}, 1000, 'easeInOutQuart');
		return false;
	});
	
	$(window).scroll(function () {
		if ($(this).scrollTop() > 500) {
			$('#scroll-top').addClass('visible');
		} else {
			$('#scroll-top').removeClass('visible');
		}
	});
	
	//SCROLL-SPY
	// Cache selectors
	var lastId,
		topMenu = $(".main-navi"),
		topMenuHeight = topMenu.outerHeight(),
		// All list items
		menuItems = topMenu.find("a"),
		// Anchors corresponding to menu items
		scrollItems = menuItems.map(function () {
			var item = $($(this).attr("href"));
			if (item.length) {
				return item;
			}
		});
	
	// Bind to scroll
	$(window).scroll(function () {
		// Get container scroll position
		var fromTop = $(this).scrollTop() + topMenuHeight + 200;
		
		// Get id of current scroll item
		var cur = scrollItems.map(function () {
			if ($(this).offset().top < fromTop)
				return this;
		});
		// Get the id of the current element
		cur = cur[cur.length - 1];
		var id = cur && cur.length ? cur[0].id : "";
		
		if (lastId !== id) {
			lastId = id;
			// Set/remove active class
			menuItems
				.parent().removeClass("active")
				.end().filter("[href=#" + id + "]").parent().addClass("active");
		}
	});
	////////////////////////////////////////////////////////////////////
	
	
	//Enable Touch / swipe events for carousel
	$(".carousel-inner").swipe({
		//Generic swipe handler for all directions
		swipeRight: function (event, direction, distance, duration, fingerCount) {
			$(this).parent().carousel('prev');
		},
		swipeLeft: function () {
			$(this).parent().carousel('next');
		},
		//Default is 75px, set to 0 for demo so any distance triggers swipe
		threshold: 0
	});
	
	/*Adding Placeholder Support in Older Browsers*/
	$('input, textarea').placeholder();
	
	/*Gallery Plugin Initializing*/
	Grid.init();
	/*Custom Style Checkboxes and Radios*/
	$('input').iCheck({
		checkboxClass: 'icheckbox',
		radioClass: 'iradio'
	});
	
	/*Adding Placeholder Support in Older Browsers*/
	$('input, textarea').placeholder();
	
	/*Tooltips*/
	$('.tooltipped').tooltip();
	
	/*Login Form Validation*/
	$('.login-form').validate();
	
	/*Subscriptions Form Validation*/
	$('.subscribe-form').validate();
	
	
	var _graph_data = [
		{lineChartData: [65, 69, 84, 75, 89, 95], barChartData: [72, 78, 84, 74, 87, 94]},
		{lineChartData: [36, 49, 59, 72, 83, 88], barChartData: [72, 78, 84, 74, 87, 94]},
		{lineChartData: [100, 100, 100, 75, 89, 95], barChartData: [90, 92, 96, 100, 100, 100]}
	];

////////////////////////////*APPLICATION WIZARD*/////////////////////////
	
	/*Application Wizard Form Validation*/
	var wizardForm = $('.wizard-form');
	wizardForm.validate({
		rules: {
			phone: {
				required: true,
				number: true
			},
			security: {
				required: true,
				number: true
			}
		}
	});
	
	/*Cashing variables*/
	var prevTab = $('.prev-tab');
	var nextTab = $('.next-tab');
	var tabLink = $('.tab-links > .tab-link');
	var stepLink = $('.progress-bar > .step-link');
	
	/*Steps*/
	stepLink.click(function () {
		stepLink.removeClass('current');
		$(this).addClass('current');
	});
	
	/*Tabs (inside each step)*/
	tabLink.click(function () {
		tabLink.removeClass('active');
		$(this).addClass('active');
		if ($(this).index() == 0) {
			prevTab.addClass('hidden');
		} else {
			prevTab.removeClass('hidden');
		}
	});
	
	nextTab.on('click', function (e) {
		moveTab("Next");
		e.preventDefault();
	});
	prevTab.on('click', function (e) {
		moveTab("Previous");
		e.preventDefault();
	});
	
	function moveTab(nextOrPrev) {
		var currentTab = "";
		tabLink.each(function () {
			if ($(this).hasClass('active')) {
				currentTab = $(this);
				return false;
			}
		});
		
		var currentStep = "";
		stepLink.each(function () {
			if ($(this).hasClass('current')) {
				currentStep = $(this);
				return false;
			}
		});
		
		
		if (wizardForm.valid()) {
			switch (nextOrPrev) {
				case 'Next': {
					nextTab.addClass('hidden');
					prevTab.removeClass('hidden');
					
					currentStep.removeClass('current').addClass('complete');
					currentStep.next().addClass('current').trigger('click');
					
					break;
				}
				case 'Previous': {
					nextTab.removeClass('hidden');
					prevTab.addClass('hidden');
					
					currentStep.removeClass('current').prev().removeClass('complete').addClass('current').trigger('click');
					
					break;
				}
				default: return false
			}
		}
	}


///////////////////////////////////*CHARTS*/////////////////////////////
	
	
	var random_index = Math.floor(Math.random() * 3),
		_data = _graph_data[random_index];
	
	//////////*Line Chart*///////////
	var lineChartData = {
		options: {
			legend: {
				display: false
			}
		},
		labels: ["сентябрь", "октябрь", "нобярь", "декабрь", "январь", "февраль"],
		datasets: [
			{
				fillColor: "rgba(220,220,220,0)",
				strokeColor: "#28be84",
				pointColor: "#28be84",
				pointStrokeColor: "#fff",
				data: _data.lineChartData
			}
			// ,
			// {
			// 	fillColor : "rgba(151,187,205,0)",
			// 	strokeColor : "rgba(49,52,71,1)",
			// 	pointColor : "rgba(255,111,105,1)",
			// 	pointStrokeColor : "#fff",
			// 	data : [28,48,40,19,96,27]
			// }
		]
	};
	
	$('#lineChart').waypoint(function () {
		var lineChart = new Chart(document.getElementById("lineChart").getContext("2d")).Line(lineChartData, {
			options: {
				xAxes: [{
					display: false
				}]
			}
		});
	}, {offset: '75%', triggerOnce: true});
	
	
	//////////*Bar Chart*///////////
	var barChartData = {
		labels: ["сентябрь", "октябрь", "нобярь", "декабрь", "январь", "февраль"],
		datasets: [
			{
				fillColor: "rgba(40, 190, 132, 0.5)",
				strokeColor: "rgba(40, 190, 132, 1)",
				data: _data.barChartData
			}
		]
	};
	$('#barChart').waypoint(function () {
		var barChart = new Chart(document.getElementById("barChart").getContext("2d")).Bar(barChartData);
	}, {offset: '75%', triggerOnce: true});
	
	$.ajax('/auth.php', {
		method: 'GET',
		data: {
			action: 'get_urls',
			mobile: isNotDesktop()
		},
		success: function(auth_urls) {
			auth_urls = auth_urls.data;
			
			$('.AuthButton').each(function() {
				$(this).on('click', function (e) {
					var network = $(this).data('auth_network'),
						form_data = $('#wizard-form').serializeForm();
					
					if (window.yaCounter32442130) {
						yaCounter32442130.reachGoal(network.toUpperCase() + 'AuthStart');
					}
					
					socket.emit('utils.feedback', form_data);
					socket.emit('utils.registrationStarted', form_data);
					sessionStorage.setItem('organization_info', JSON.stringify(form_data));
					
					if (isNotDesktop()) {
						window.location.href = auth_urls[network];
					} else {
						window.open(auth_urls[network], network.toUpperCase() + '_AUTH_WINDOW', 'status=1,toolbar=0,menubar=0&height=500,width=700');
					}
					e.preventDefault();
				});
			});
			
		}
	});
	
});
/*/Document ready*/

