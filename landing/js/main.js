$(function(){

	var dialog_step = 0;

	$(".nav-burger").on("click", function(){
		var $nav = $(this).parents(".nav");
		$nav.toggleClass("nav-open");
	});

	$("#mobile-switch-apple").one("click", function(){
		switchMobile("apple")
	});

	$("#send_form").off('click').on("click", function(){
		var $form = $(this).parents("form"),
			$loader = $("#loader"),
			$required = $form.find(":required"),
			is_valid = true;

		$required.each(function(i, el){
			var $this = $(el);
			if(!$this.val().trim() || ($this.is("[type='email']") && !validateEmail($this.val()))){
				$this.addClass("status-error").one("input", function(){
					$(this).removeClass("status-error");
				});
				is_valid = false;
			}
		});
		if(is_valid){
			$form.hide();

			var arr = $form.serializeArray(),
				data = {};

			arr.forEach(function(val){
				data[val.name] = val.value;
			})

			socket.emit('feedback', data);
			$form.after('<p>Спасибо за интерес к нашему сервису.<br>Ожидайте ответ в течение суток</p>');
		}
	});

	initDialog();

	function validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}



	function switchMobile(next_name) {
		var $wrap = $("#mobiles");
		if(!$wrap.hasClass("mobile-1") && !$wrap.hasClass("mobile-2")){
			$wrap.addClass("mobile-1");
			if(dialog_step < 2){
				$("#mobile-2-video").get(0).pause();
				$("#mobile-1-video").attr('src', 'landing/videos/apple_'+(dialog_step+1)+'.mp4').load().get(0).play();
			}
		} else {
			if(dialog_step < 2){
				if($wrap.hasClass("mobile-1")){
					$("#mobile-1-video").get(0).pause();
					$("#mobile-2-video").attr('src', 'landing/videos/android_'+(dialog_step+1)+'.mp4').load().get(0).play();
				} else {
					$("#mobile-2-video").get(0).pause();
					$("#mobile-1-video").attr('src', 'landing/videos/apple_'+(dialog_step+1)+'.mp4').load().get(0).play();
				}
			}
			$wrap.toggleClass("mobile-1 mobile-2");
		}
		next_name = next_name == "apple" ? "android" : "apple";
		setTimeout(function(){
			$("#mobile-switch-"+next_name).one("click", function(){
				switchMobile(next_name)
			});
		}, 700);
	}

	function initDialog(){
		var $tmpl = $("<div>").addClass("dialogue-bubble"),
			$wrap = $("<div>").addClass("dialogue-bubble-wrapper"),
			$loader = $tmpl.clone().addClass("future").append($("<div>").addClass("dots-loader")),
			$wrapper = $("#dialogues-wrap"),
			bubbles = [
				[
					"<p>Почему тебе нужен Evendate?</p>",
					"<p>Ежедневно ты пропускаешь десятки мероприятий в своих любимых местах, поскольку не узнаешь о них.</p>"
				],
				[
					"<p>Как мы решили эту проблему?</p>",
					"<p>Теперь с помощью Evendate ты сможешь собрать все любимые места в собственную персонализированную ленту: университеты, парки, бары и многие другие организации в одном удобном приложении.</p>"
				],
				[
					"<p>А еще...</p>",
					"<p>Ты сможешь получать рекомендации на основе своих интересов и узнавать, какие мероприятия посещают твои друзья из социальных сетей.</p>"
				]
			];


		function nextStep(step){
			if(step < 3){
				$(".bullet").removeClass("active").eq(step).addClass("active");
				$wrapper.append($loader.clone());
				$(".dialogue-bubble.future").animate({opacity: 1, left: 0}, 400);
				loadBubble(step);
			}
		}

		function loadBubble(step){
			window.timer = setTimeout(function(){
				var $future = $(".dialogue-bubble.future");
				$future.html($wrap.clone().append(bubbles[step]));
				$future.animate({height: $future.children().outerHeight(), width: $future.children().outerWidth()}, 400, function(){
					$future.removeClass("future");
				});
			}, 2000);
		}

		$(".bullet").on("click", function(){
			var $this = $(this),
				$bullets = $(".bullet"),
				index = $bullets.index($this);
			clearTimeout(window.timer);
			$bullets.removeClass("active").eq(index).addClass("active");
			nextStep(index);
		});

		nextStep(dialog_step);
		$("#mobile-2-video").on('ended', function(){
			nextStep(++dialog_step);
			if(dialog_step < 2){
				$(this).attr('src', 'landing/videos/android_'+(dialog_step+1)+'.mp4').load().get(0).play();
			}
		});
		$("#mobile-1-video").on('ended', function(){
			nextStep(++dialog_step);
			if(dialog_step < 2){
				$(this).attr('src', 'landing/videos/apple_'+(dialog_step+1)+'.mp4').load().get(0).play();
			}
		});
	}

});
