String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

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

function bindDatePickers($parent){
	$parent.find('.DatePicker').not('.-Handled_DatePicker').each(function(i, elem){
		(new DatePicker(elem, $(elem).data())).init();
	});
}

function bindTimeInput($parent){
	$parent.find('.TimeInput').not('.-Handled_TimeInput').each(function(i, elem){
		initTimeInput(elem);
	});
}

function bindSelect2($parent){
	$parent.find('.ToSelect2').not('.-Handled_ToSelect2').select2({
		containerCssClass: 'form_select2',
		dropdownCssClass: 'form_select2_drop'
	}).addClass('-Handled_ToSelect2');
}


function bindRippleEffect(){
	$('.RippleEffect').not('-Handled_RippleEffect').on('click', function(e){
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

		$ripple
			.css({top: y+'px', left: x+'px'})
			.addClass('animate')
			.one('animationend webkitAnimationEnd', function(){
				$ripple.removeClass('animate');
			});
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

function showModal(name){
	var $modal = $('.'+name.capitalize()+'Modal');

	if($modal.length > 0){
		$('.modal_unit').removeClass('-active');
		$('html').addClass('-open_modal');
		$modal.addClass('-active').parent().addClass('-active');
		$('.modal_wrapper').off('click').on('click', function(e){
			if(!$(e.target).closest($modal).length){
				closeModal();
			}
		});
		$modal.find('.CloseModal').off('click').on('click', closeModal);
	} else {
		throw Error('Модального окна '+name+' нет');
	}

}

function closeModal(){
	$('html').removeClass('-open_modal');
	$('.modal_unit').removeClass('-active').parent().removeClass('-active').trigger('modal-close');
}

function initCrop(source, $endpoint_img, options){
	var $img = $('.Cropper').children('img'),
		$crop_button = $('.CropButton'),
		$destroy_button = $('.DestroyCropButton');
	options = typeof options == 'undefined' ? {} : options;

	$img.cropper('destroy').attr('src', source).cropper(options);
	showModal('cropper');

	$img.closest('.CropperModal').on('modal-close', function(){
		$img.cropper('destroy');
		$crop_button.off('click');
		$destroy_button.off('click');
	});

	$crop_button.off('click').one('click', function(){
		$endpoint_img.attr('src', $img.cropper('getCroppedCanvas').toDataURL()).data('crop_data', $img.cropper('getData'));
		$endpoint_img.trigger('crop-done');
		closeModal();
	});
	$destroy_button.off('click').one('click', closeModal);
}