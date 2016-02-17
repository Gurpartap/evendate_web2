function DatePicker($datepicker, options){
	this.options = {
		classes: {
		},
		close_on_pick: true,
		labels: {}
	};
	$.extend(true, this.options, options);

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
			this.$input = $datepicker;
			this.$datepicker = {};
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
		.$input.data('datepicker', this);
	this.$input.addClass('-unselectable -Handled_DatePicker');
	return this;
};


DatePicker.prototype.bindOpener = function(){
	var self = this;
	this.$input.one('click', function(){
		self.openDialog();
	});
	return this;
};


DatePicker.prototype.openDialog = function(){
	var self = this;

	this.$input.after(tmpl('datepicker', {}));
	this.$datepicker = this.$input.siblings('.date_picker');
	this.calendar = new Calendar(this.$datepicker.children('.DatePickerCalendar'), {});
	this.calendar.init();
	this.calendar.$calendar.on('days-changed', function(){
		self.prev_selected_day = self.selected_day;
		self.selected_day = self.calendar.selected_days.toString();
		self.formated_selected_day = self.calendar.selected_days.toString().split('-').reverse().join('.');
		if(self.$input.is('input')){
			self.$input.val(self.formated_selected_day);
		} else {
			self.$input.find('label').text(self.formated_selected_day);
			self.$input.find('input').val(self.formated_selected_day)
		}

		if(self.options.close_on_pick){
			self.destroy();
		}
		self.$input.trigger('date-picked');
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
	if(($this.closest(this.$datepicker).length === 0 && $this.closest(this.$input).length === 0) || $this.closest('.SubmitDatePicker').length){
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
	this.$datepicker.remove();
	delete this.calendar;
	this.bindOpener().$input.data('datepicker', '');
	return this;
};
