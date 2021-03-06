/**
 * @class DatePicker
 */
DatePicker = (function() {
	/**
	 *
	 * @param {(jQuery|Element|string)} $datepicker
	 * @param {object} [options]
	 * @constructor
	 * @construct DatePicker
	 *
	 * @property {jQuery} $datepicker
	 * @property {jQuery} $datepicker_modal
	 * @property {jQuery} $input
	 * @property {Calendar} calendar
	 * @property {string} selected_day
	 * @property {string} prev_selected_day
	 * @property {(string|function)} format
	 * @property {?Moment} m_prev_selected_day
	 * @property {?Moment} m_selected_day
	 * @property {string} formated_selected_day
	 */
	function DatePicker($datepicker, options){
		var self = this;
		
		this.options = {
			classes: {
			},
			close_on_pick: true,
			min_date: false,
			max_date: false,
			labels: {}
		};
		
		if ($datepicker instanceof Element || typeof $datepicker === 'string') {
			$datepicker = $($datepicker);
		}
		if (!($datepicker instanceof jQuery)) {
			
			throw new TypeError('Аргументом конструктора DatePicker должен быть экземпляром jQuery, элементом DOM, либо CSS селектором');
		}
		if ($datepicker.length === 0) {
			
			throw new Error('Такого элемента не существует');
		} else if ($datepicker.length > 1) {
			
			throw new Error('Элементов с заданным аргументов найдено несколько');
		}
		
		$.extend(true, this.options, options, $datepicker.data());
		this.$datepicker = $datepicker;
		this.$datepicker_modal = tmpl('datepicker', {});
		this.$input = $datepicker.is('input') ? $datepicker : $datepicker.find('input');
		this.calendar = new Calendar(this.$datepicker_modal.children('.DatePickerCalendar'), {
			min_date: this.options.min_date,
			max_date: this.options.max_date
		});
		this.selected_day = !empty(this.options.selected_day) ? this.options.selected_day : this.$input.val() || '';
		this.prev_selected_day = this.selected_day;
		this.format = !empty(this.options.format) ? this.options.format : __LOCALE.DATE.DATE_FORMAT;
		
		Object.defineProperties(this, {
			m_prev_selected_day: {
				get: function() {
				
					return self.prev_selected_day ? moment(self.prev_selected_day) : null;
				}
			},
			m_selected_day: {
				get: function() {
					
					return self.selected_day ? moment(self.selected_day) : null;
				}
			},
			formated_selected_day: {
				get: function() {
					if (empty(self.selected_day)) {
						
						return null;
					}
					
					if (isFunction(self.format)) {
						
						return self.format.call(self, self.m_selected_day, self.m_prev_selected_day);
					}
				
					return self.m_selected_day.format(self.format);
				}
			}
		});
	}
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.init = function(){
		var self = this;
		this
			.bindOpener()
			.$datepicker.data('datepicker', this)
			.data('instance', this);
		this.$datepicker.addClass('-unselectable -Handled_DatePicker');
		
		if (this.$input.length) {
			this.$input.attr('readonly', true);
			Object.defineProperty(this.$input.get(0), 'value', {
				get: function() {
					
					return self.selected_day;
				}
			});
		}
		
		this.calendar.init().$calendar.on('change:days', function(){
			self.prev_selected_day = self.selected_day;
			self.selected_day = self.calendar.selected_days.toString();
			self.formated_selected_day = self.calendar.selected_days.toString().split('-').reverse().join('.');
			if(!self.$datepicker.is('input')){
				self.$datepicker.find('.DatePickerDisplayText').text(self.formated_selected_day);
			}
			self.$input.val(self.selected_day).trigger('change');
			
			if(self.options.close_on_pick){
				self.closeDialog();
			}
			self.$datepicker.trigger('date-picked');
			self.$datepicker.trigger('change');
		});
		
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
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
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.openDialog = function(){
		var datepicker_position = this.$datepicker.offset();
		
		$('body').append(this.$datepicker_modal);
		this.$datepicker_modal.css({
			top: datepicker_position.top + this.$datepicker.outerHeight() + 2,
			left: datepicker_position.left + this.$datepicker.width() - this.$datepicker_modal.width(),
			maxWidth: this.$datepicker.width()
		});
		this.calendar.renderTable();
		this.bindCloseDialog();
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.bindCloseDialog = function(){
		var self = this;
		
		$(document)
			.off('click.checkOnClick')
			.on('click.checkOnClick', function(e){
				var $this = $(e.target);
				if(($this.closest(self.$datepicker_modal).length === 0 && $this.closest(self.$datepicker).length === 0) || $this.closest('.SubmitDatePicker').length){
					self.closeDialog();
				}
			})
			.off('keydown.checkOnKeyDown')
			.on('keydown.checkOnKeyDown', function(e){
				if(e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27){
					self.closeDialog();
				}
			});
		
		//TODO: BUG. Click on another datepicker doesn't close current
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.closeDialog = function() {
		$(document).off('click.checkOnClick').off('keydown.checkOnKeyDown');
		this.$datepicker_modal.detach();
		this.calendar.flush();
		this.bindOpener();
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.destroy = function(){
		this.closeDialog().$datepicker.data('datepicker', '');
		return this;
	};
	
	return DatePicker;
}());