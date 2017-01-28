function DatePicker($datepicker, options){
	this.options = {
		classes: {
		},
		close_on_pick: true,
		min_date: false,
		max_date: false,
		labels: {}
	};

	switch(true){
		case ($datepicker instanceof Element):
		case (typeof $datepicker == 'string'): {
			$datepicker = $($datepicker);
			if($datepicker.length === 0)
				throw new Error('Такого элемента не существует');
			else if($datepicker.length > 1)
				throw new Error('Элементов с заданным аргументов найдено несколько');
		}
		case ($datepicker instanceof jQuery): {
			$.extend(true, this.options, options, $datepicker.data());
			this.$datepicker = $datepicker;
			this.$datepicker_modal = tmpl('datepicker', {});
			this.$input = $datepicker.is('input') ? $datepicker : $datepicker.find('input');
			this.calendar = {};
			this.prev_selected_day = (typeof this.options.selected_day !== 'undefined') ? this.options.selected_day : '';
			this.selected_day = (typeof this.options.selected_day !== 'undefined') ? this.options.selected_day : '';
			this.formated_selected_day = this.selected_day.toString().split('-').reverse().join('.');
			break;
		}
		default: {
			throw new TypeError('Аргумент должен быть экземпляром jQuery, элементом DOM, либо CSS селектором')
		}
	}
}


DatePicker.prototype.init = function(){
	this
		.bindOpener()
		.$datepicker.data('datepicker', this);
	this.$datepicker.addClass('-unselectable -Handled_DatePicker');
	return this;
};


DatePicker.prototype.bindOpener = function(){
	var self = this;
	function open(){
		if(self.$input.is(':disabled')){
			self.$datepicker.one('click', open);
		} else {
			self.openDialog();
		}
	}
	this.$datepicker.one('click', open);
	return this;
};


DatePicker.prototype.openDialog = function(){
	var self = this,
		datepicker_position = this.$datepicker.offset();
	
	$('body').after(this.$datepicker_modal);
	this.$datepicker_modal.css({
		top: datepicker_position.top + this.$datepicker.outerHeight() + 2,
		left: datepicker_position.left + this.$datepicker.width() - this.$datepicker_modal.width(),
		maxWidth: this.$datepicker.width()
	});
	this.calendar = new Calendar(this.$datepicker_modal.children('.DatePickerCalendar'), {
		min_date: this.options.min_date,
		max_date: this.options.max_date
	});
	this.calendar.init();
	this.calendar.$calendar.on('days-changed', function(){
		self.prev_selected_day = self.selected_day;
		self.selected_day = self.calendar.selected_days.toString();
		self.formated_selected_day = self.calendar.selected_days.toString().split('-').reverse().join('.');
		if(!self.$datepicker.is('input')){
			self.$datepicker.find('label').text(self.formated_selected_day);
		}
		self.$input.val(self.selected_day).trigger('change');

		if(self.options.close_on_pick){
			self.destroy();
		}
		self.$datepicker.trigger('date-picked');
	});
	this.bindCloseDialog();
	return this;
};


DatePicker.prototype.bindCloseDialog = function(){
	var self = this;

	$(document)
		.off('click.checkOnClick')
		.on('click.checkOnClick', function(e){self.checkOnClick(e)})
		.off('keydown.checkOnKeyDown')
		.on('keydown.checkOnKeyDown', function(e){self.checkOnKeyDown(e)});

	//TODO: Click on another datepicker doesn't close current
	return this;
};

DatePicker.prototype.checkOnClick = function(e){
	var $this = $(e.target);
	if(($this.closest(this.$datepicker_modal).length === 0 && $this.closest(this.$datepicker).length === 0) || $this.closest('.SubmitDatePicker').length){
		this.destroy();
	}
};

DatePicker.prototype.checkOnKeyDown = function(e){
	var self = this;
	if(e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27){
		self.destroy();
	}
};


DatePicker.prototype.destroy = function(){
	$(document).off('click.checkOnClick').off('keydown.checkOnKeyDown');
	this.$datepicker_modal.detach();
	delete this.calendar;
	this.bindOpener().$datepicker.data('datepicker', '');
	return this;
};
