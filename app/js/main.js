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
		} else if($this.is('input, textarea, select')){
			$this.closest('.form_unit').toggleStatus(statuses);
		}	else {
			$this.find('.form_unit').toggleStatus(statuses);
		}

		return this;
	},

	/**
	 * Сбор данных с формы
	 * Метод возвращает javaScript объект, состоящий из атрибутов name и value элементов формы.
	 * Если output_type стоит на array, то возвращается массив из объектов с полями name и value (аналогично с serializeArray).
	 *
	 * @method external:"jQuery.fn".serializeForm
	 *
	 * @param {string} [output_type=object]
	 * @returns {Array|Object}
	 */
	serializeForm: function(output_type) {
		var zb = /^(?:input|select|textarea|keygen)/i,
			yb = /^(?:submit|button|image|reset|file)$/i,
			T = /^(?:checkbox|radio)$/i,
			xb = /\r?\n/g,
			elements = this.map(function() {
				var a = $.prop(this, "elements");
				return a ? $.makeArray(a) : this
			});

		switch(output_type){
			case "array": {
				/* Работает так же как и serializeArray, с некоторыми модификациями */
				return elements.filter(function() {
					var a = this.type;
					return this.name
						&& !$(this).is(":disabled")
						&& zb.test(this.nodeName)
						&& !yb.test(a)
						&& ((this.checked && this.value != "on") || a != "radio")
						&& ((this.checked && this.value != "on") || this.value == "on" || a != "checkbox")
				}).map(function(a, b) {
					var c = $(this).val(),
						std = "";
					switch(this.type){
						case "radio":
						case "checkbox":{
							std = c == "on" ? ( this.checked ? 1 : 0 ) : c;
							break;
						}
						default:{
							std = c.replace(xb, "\r\n");
						}
					}
					return null == c ? null : {
						name: b.name,
						value: std
					}
				}).get();
			}
			case "object":
			default: {
				var output = {};
				elements.filter(function() {
					var a = this.type;
					return this.name && !$(this).is(":disabled") && zb.test(this.nodeName) && !yb.test(a) && !T.test(a)
				}).each(function(i,el){
					var name = el.name,
						value = $(el).val();

					if(elements.filter("[name='"+name+"']").length > 1 && value != ""){
						output[name] = typeof(output[name]) == "undefined" ? [] : output[name];
						output[name].push(value ? value.replace(xb, "\r\n") : value)
					} else {
						output[name] = value ? value.replace(xb, "\r\n") : value;
					}
				});
				elements.filter(function() {
					var a = this.type;
					return this.name && !$(this).is(":disabled") && T.test(a) && ((this.checked && this.value != "on") || (this.value == "on" && a == "checkbox"))
				}).each(function(i,el){
					var name = el.name,
						value = el.value;

					switch(el.type){
						case "radio":{
							output[name] = value;
							break;
						}
						case "checkbox":{
							if(elements.filter("[name='"+name+"']").length > 1 && value != "on"){
								output[name] = typeof(output[name]) == "undefined" ? [] : output[name];
								output[name].push(value)
							}
							else if(value != "on")
								output[name] = value;
							else
								output[name] = el.checked ? true : false;
							break;
						}
					}
				});
				return output;
			}
		}
	}
});

function handleErrorField($unit){
	if(!$unit instanceof jQuery){
		handleErrorField($($unit));
	} else if(!$unit.is('.form_unit')) {
		handleErrorField($unit.closest('.form_unit'));
	} else {
		if(!$unit.closest('form_unit').hasClass('-status_error')){
			var $input = $unit.find('input, select, textarea');
			$unit
				.toggleStatus('error')
				.off('input.clear_error change.clear_error')
				.one('input.clear_error change.clear_error', function(){
					$unit.off('input.clear_error change.clear_error').toggleStatus('error');
					$input.off('blur.clear_error');
				});
			$input
				.off('blur.clear_error')
				.one('blur.clear_error', function(){
					if($(this).val() !== ""){
						$unit.trigger('input.clear_error');
					}
				});
		}
	}
}

function bindDatePickers($parent){
	$parent.find('.DatePicker').not('.-Handled_DatePicker').each(function(i, elem){
		(new DatePicker(elem, $(elem).data())).init();
	}).addClass('-Handled_DatePicker');
}

function bindTimeInput($parent){
	$parent.find('.TimeInput').not('.-Handled_TimeInput').each(function(i, elem){
		initTimeInput(elem);
	}).addClass('-Handled_TimeInput');
}

function bindTabs($parent){
	$parent.find('.Tabs').not('.-Handled_Tabs').each(function(i, elem){
		var $this = $(elem),
			$tabs = $this.find('.Tab'),
			$bodies = $this.find('.TabsBody');

		$tabs.on('click', function(){
			$tabs.removeClass('-active');
			$bodies.removeClass('-active');
			$(this).addClass('-active');
			$bodies.eq($tabs.index(this)).addClass('-active');
		})
	}).addClass('-Handled_Tabs');
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
			$prompt = $this.siblings('.form_prompt');
		if(!$prompt.length){
			$this.after($('<p>').addClass('form_prompt').text($this.val().length+'/'+max));
			$prompt = $this.siblings('.form_prompt');
		} else {
			$prompt.text($this.val().length+'/'+max);
		}
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

	function onBlur(){
		var $this = $(this);
		if($this.val() == "0" || $this.val() === ""){
			$this.val("00");
		}
		else if($this.val() <= 9){
			$this.val("0"+parseInt($this.val()));
		}
	}

	$hours.inputmask('Regex', {regex: "([01]?[0-9]|2[0-3])"}).on('keyup', function(){
		if($hours.val() > 2 || $hours.val() == "00"){
			$minutes.focus();
			$hours.trigger('blur');
		}
	}).on('blur', onBlur);
	$minutes.inputmask('Regex', {regex: "[0-5][0-9]"}).on('blur', onBlur);
	$time_field.addClass('-Handled_TimeInput');
}

function toDataUrl(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		var reader  = new FileReader();
		reader.onloadend = function () {
			callback(reader.result);
		};
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.send();
}

function showModal(name){
	var $modal = $('.'+name.capitalize()+'Modal');

	if($modal.length > 0){
		$('.modal_unit').removeClass('-active');
		$('html').addClass('-open_modal');
		$modal.addClass('-active').parent().addClass('-active');
		$('.modal_wrapper').off('mousedown').on('mousedown', function(e){
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
		$destroy_button = $('.DestroyCropButton'),
		opt = {
			zoomable: false,
			zoomOnWheel: false/*
			minCanvasWidth: 500,
			minCanvasHeight: 500,
			minCropBoxWidth: 500,
			minCropBoxHeight: 500,
			minContainerWidth: 500,
			minContainerHeight: 500*/
		};
	options = typeof options == 'object' ? options : {};
	$.extend(opt, options);

	$img.cropper('destroy').attr('src', source).cropper(opt);
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

function showNotification(text, time, status){
	var $notification = $('#notification');
	$('#notification_text').text(text);
	$notification.addClass('-show');
	if(time !== 'infinite') {
		setTimeout(function(){
			$notification.removeClass('-show');
		}, time);
	}
}