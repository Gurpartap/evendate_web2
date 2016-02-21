function bindRippleEffect(){
	$('.RippleEffect').not('-Handled_RippleEffect').click(function(e){
		var $this = $(this), $ripple, size, x, y;

		if($this.children('.ripple').length == 0)
			$this.prepend("<span class='ripple'></span>");

		$ripple = $this.children('.ripple');
		$ripple.removeClass('animate');

		if(!$ripple.height() && !$ripple.width()) {
			size = Math.max($this.outerWidth(), $this.outerHeight());
			$ripple.css({height: size, width: size});
		}

		x = e.pageX - $this.offset().left - ($ripple.width() / 2);
		y = e.pageY - $this.offset().top - ($ripple.height() / 2);

		$ripple.css({top: y+'px', left: x+'px'}).addClass('animate');
	}).addClass('-Handled_RippleEffect');
}

function bindFileLoadButton(){
	$('.FileLoadButton').not('-Handled_FileLoadButton').click(function(e){
		var $this = $(this);
		$this.children('input').get(0).click();
	}).addClass('-Handled_FileLoadButton');
}


function limitInputSize(){
	var $elements = $('.LimitSize').not('.-Handled_LimitSize');

	$elements.each(function(i, e) {
		var $this = $(e),
			$form_unit = $this.closest('.form_unit'),
			max = $this.data('maxlength'),
			$prompt;
		if(!$this.siblings('.form_prompt').length){
			$this.after($('<p>').addClass('form_prompt').text($this.val().length+'/'+max));
		}
		$prompt = $this.siblings('.form_prompt');
		$this.on('input', function(){
			var length = $this.val().length;
			if(length > max){
				$form_unit.addClass('-status_error');
			} else if($form_unit.hasClass('-status_error')) {
				$form_unit.removeClass('-status_error');
			}
			$prompt.text($this.val().length+'/'+max);
		})
	});
	$elements.addClass('-Handled_LimitSize');
}

function initTimeInput(time_field){
	var $time_field = $(time_field),
		$hours = $time_field.find('input').eq(0),
		$minutes = $time_field.find('input').eq(1);

	$hours.inputmask('Regex', {regex: "([01]?[0-9]|2[0-3])"}).on('keyup', function(){
		if($hours.val() > 2){
			$minutes.focus();
		}
	});
	$minutes.inputmask('Regex', {regex: "[0-5][0-9]"});
	$hours.on('input', function(){

	});
	$time_field.addClass('-Handled_TimeInput');
}


$.fn.extend({
	toggleStatus: function(statuses) {
		var $this = this;

		if($this.is('.form_unit')){
			statuses.split(' ').forEach(function(status){
				if(status === 'disabled'){
					var $form_elements = $this.find('input, select, textarea');
					if($this.hasClass('-status_disabled')){
						$form_elements.each(function(){$(this).removeAttr('disabled');});
					} else {
						$form_elements.each(function(){$(this).attr('disabled', true);});
					}
				}
				$this.toggleClass('-status_'+status);
			});
		} else {
			$this.find('.form_unit').toggleStatus(statuses);
		}

		return this;
	}
});