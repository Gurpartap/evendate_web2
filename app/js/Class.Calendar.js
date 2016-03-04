function Calendar($calendar, options){
	this.options = {
		classes: {
			wrapper_class: 'calendar_wrapper',
			header_class: 'calendar_header',
			prev_btn_class: 'calendar_prev_btn',
			next_btn_class: 'calendar_next_btn',
			month_name_class: 'calendar_month_name',
			table_class: 'calendar_month',
			thead_class: 'calendar_thead',
			tbody_class: 'calendar_tbody',
			tr_class: 'calendar_week',
			head_tr_class: 'calendar_weekdays_row',
			th_class: 'calendar_weekday',
			td_class: 'calendar_day',
			td_disabled: 'calendar_day_disabled',
			table_cell_class: 'calendar_cell'
		},
		selection_type: 'single',
		multi_selection: false,
		weekday_selection: false,
		month_selection: false,
		min_date: false,
		max_date: false,
		locale: 'ru',
		labels: {}
	};
	switch(true){
		case ($calendar instanceof Element):
		case (typeof $calendar == "string"): {
			$calendar = $($calendar);
			if($calendar.length === 0)
				throw new Error("Такого элемента не существует");
			else if($calendar.length > 1)
				throw new Error("Элементов с заданным аргументов найдено несколько");
		}
		case ($calendar instanceof jQuery): {
			$.extend(true, this.options, options, $calendar.data());
			if(this.options.min_date !== false && this.options.max_date !== false && moment(this.options.max_date).diff(this.options.min_date, 'days') <= 0){
				this.options.max_date = false;
			}
			if(this.options.weekday_selection === true || this.options.month_selection === true ) {
				this.options.multi_selection = true;
			}
			this.selected_days = [];
			this.selected_weeks = {};
			this.selected_months = [];
			this.last_action = '';
			this.last_selected_days = '';
			this.now_selected_day = '';
			this.prev_selected_day = '';
			this.formatted_days = {};
			this.$calendar = $calendar;
			this.current_month = moment();
			this._today = moment();
			break;
		}
		default: {
			throw new TypeError("Аргумент должен быть экземпляром jQuery, элементом DOM, либо CSS селектором")
		}
	}
}

Calendar.prototype.setMonth = function(next){
	switch(next){
		case 'prev':{
			this.current_month = this.current_month.add(-1, 'months'); break;
		}
		case 'next':{
			this.current_month = this.current_month.add(1, 'months'); break;
		}
		case 'current':{
			this.current_month = moment(); break;
		}
		default: {
			this.current_month = this.current_month.add(next, 'months');
		}
	}
	return this;
};

Calendar.prototype.destroyTable = function(){
	this.$calendar.find('.'+this.options.classes.th_class).removeClass(__C.CLASSES.ACTIVE).off('click');
	this.$calendar.find('.MonthName').removeClass(__C.CLASSES.ACTIVE).off('click');
	this.$calendar.find('.CalendarTableBody').remove();
	return this;
};

Calendar.prototype.setMonthName = function(){
	this.$calendar.find('.MonthName')
		.data('month', this.current_month.month())
		.text(this.current_month.lang('ru').format("MMMM YYYY").capitalize());
	return this;
};

Calendar.prototype.buildTable = function(){
	var $calendar_table = this.$calendar.find('.CalendarTable'),
		days_count = this.current_month.daysInMonth(),
		first_day_in_month = this.current_month.date(1).day(),
		last_day_in_month = this.current_month.date(days_count).day(),
		td_days = [],
		td_classes = [],
		this_day,
		this_moment;
	for(var day = 1; day <= days_count; day++){
		this.current_month.date(day);
		this_day = this.current_month.format(__C.DATE_FORMAT);
		this_moment = moment(this_day);

		td_classes = [
			this.options.classes.table_cell_class,
			this.options.classes.td_class,
			'Day_'+this_day,
			'DayOfWeek_'+this.current_month.day(),
			'DayOfMonth_'+this.current_month.month()
		];
		if((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
			td_classes.push(this.options.classes.td_disabled);
		if(this.current_month.format(__C.DATE_FORMAT) == this._today.format(__C.DATE_FORMAT))
			td_classes.push('today');

		td_days.push(tmpl('calendar-div', {
			td_classes: td_classes.join(' '),
			number: this.current_month.date(),
			day_number: this.current_month.day(),
			date: this.current_month.format(__C.DATE_FORMAT),
			date_text: this.current_month.format('DD MMMM YYYY')
		}));
	}
	var curr_month_clone = moment(this.current_month._d);
	if (first_day_in_month != 1){
		curr_month_clone.add(-1, 'months');
		curr_month_clone.date(curr_month_clone.daysInMonth());
		do {
			this_day = curr_month_clone.format(__C.DATE_FORMAT);
			this_moment = moment(this_day);
			td_classes = [
				this.options.classes.table_cell_class,
				this.options.classes.td_class,
				'Day_'+this_day,
				'DayOfWeek_'+curr_month_clone.day(),
				'DayOfMonth_'+curr_month_clone.month(),
				'not_this_month'
			];
			if((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
				td_classes.push(this.options.classes.td_disabled);

			td_days.unshift(tmpl('calendar-div', {
				td_classes: td_classes.join(' '),
				number: curr_month_clone.date(),
				day_number: curr_month_clone.day(),
				date: curr_month_clone.format(__C.DATE_FORMAT),
				date_text: curr_month_clone.format('DD MMMM YYYY')
			}));
			curr_month_clone.add(-1, 'days');
		} while(curr_month_clone.day() != 0);
	}

	if (last_day_in_month != 0){
		curr_month_clone = moment(this.current_month._d);
		do {
			curr_month_clone.add(1, 'days');
			this_day = curr_month_clone.format(__C.DATE_FORMAT);
			this_moment = moment(this_day);
			td_classes = [
				this.options.classes.table_cell_class,
				this.options.classes.td_class,
				'Day_'+this_day,
				'DayOfWeek_'+curr_month_clone.day(),
				'DayOfMonth_'+curr_month_clone.month(),
				'not_this_month'
			];
			if((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
				td_classes.push(this.options.classes.td_disabled);

			td_days.push(tmpl('calendar-div', {
				td_classes: td_classes.join(' '),
				number: curr_month_clone.date(),
				day_number: curr_month_clone.day(),
				date: curr_month_clone.format(__C.DATE_FORMAT),
				date_text: curr_month_clone.format('DD MMMM YYYY')
			}));
		} while(curr_month_clone.day() != 0);
	}
	var $tbody = $('<tbody>').addClass('CalendarTableBody'),
		tds_in_tr = 0,
		trs_count = 0,
		$trs = [tmpl('calendar-row', {tr_class: this.options.classes.tr_class})];
	for(var i = 0; i < td_days.length; i++){
		if (tds_in_tr == 7 ){
			$trs.push(tmpl('calendar-row', {tr_class: this.options.classes.tr_class}));
			tds_in_tr = 0;
			trs_count++;
		}
		$trs[trs_count].append(td_days[i]);
		tds_in_tr++;
	}
	$trs.forEach(function(item){
		$tbody.append(item);
	});
	$calendar_table.append($tbody);
	return this;
};

Calendar.prototype.renderTable = function(){
	this
		.destroyTable()
		.buildTable()
		.activateSelectedDays()
		.setMonthName();

	if(this.options.multi_selection){
		this.bindDragSelection();
	} else {
		this.bindDaySelection();
	}
	if(this.options.weekday_selection === true){
		this.bindWeekdaySelection();
	}
	if(this.options.month_selection === true){
		this.bindMonthSelection();
	}

	return this;
};

Calendar.prototype.selectToday = function(){
	this.$calendar.find('.'+this.options.classes.td_class+'.today').addClass(__C.CLASSES.ACTIVE);
	return this;
};

//TODO: Make formated days
//TODO: Make range selection
Calendar.prototype.formatDays = function(){
	var genitive_month_names = {
			'январь': 'января',
			'февраль': 'февраля',
			'март': 'марта',
			'апрель': 'апреля',
			'май': 'мая',
			'июнь': 'июня',
			'июль': 'июля',
			'август': 'августа',
			'сентябрь': 'сентября',
			'октябрь': 'октября',
			'ноябрь': 'ноября',
			'декабрь': 'декабря'
		},
		_date = moment(this.now_selected_day),
		month_num = _date.month(),
		month = _date.month(month_num),
		days_in_month = month.daysInMonth(),
		_day = month.date(1);

	if(typeof this.formatted_days[month_num] === 'undefined'){
		this.formatted_days[month_num] = {};
		this.formatted_days[month_num].selected_days = [];
		this.formatted_days[month_num].month_name = genitive_month_names[_date.format('MMMM')];
	}

	this.formatted_days[month_num].selected_days.push(_date.format(__C.DATE_FORMAT));
	this.formatted_days[month_num].text = '';

	while(days_in_month){
		console.log(this.formatted_days[month_num].selected_days);
		if(this.formatted_days[month_num].selected_days.indexOf(_day.format(__C.DATE_FORMAT)) !== -1){
			this.formatted_days[month_num].text += ''+_day.format('D');
		}
		_day = _day.add(1, 'd');
		days_in_month--;
	}
	console.log(this.formatted_days[month_num].text);

	return this;
};

Calendar.prototype.selectDays = function(days){
	var self = this;

	function select(day){
		var $this_day = self.$calendar.find('.Day_'+day);
		if(self.options.multi_selection === true) {
			if(self.selected_days.indexOf(day) === -1){
				self.selected_days.push(day);
				self.selected_days.sort();
			}
		}	else {
			self.$calendar.find('.'+self.options.classes.td_class+'.'+__C.CLASSES.ACTIVE).removeClass(__C.CLASSES.ACTIVE);
			self.selected_days = [day];
		}

		//self.prev_selected_day = self.now_selected_day;
		//self.now_selected_day = $this_day.data('date');
		//this.formatDays();

		self.$calendar.find('.Day_'+day).addClass(__C.CLASSES.ACTIVE);
	}


	if(Array.isArray(days)){
		var removing_days = [];
		days.forEach(function(day){
			if((self.options.min_date !== false && !(moment(day).diff(self.options.min_date) >= 0) ) || (self.options.max_date !== false && !(moment(day).diff(self.options.max_date) <= 0))){
				removing_days.push(day);
			} else {
				select(day);
			}
		});
		removing_days.forEach(function(day) {
			days.splice(days.indexOf(day), 1)
		})
	} else {
		if((self.options.min_date !== false && !(moment(days).diff(self.options.min_date) >= 0) ) || (self.options.max_date !== false && !(moment(days).diff(self.options.max_date) <=0))){
			days = [];
		} else {
			select(days);
			days = [days];
		}
	}
	if(days.length){
		self.last_action = 'select';
		self.last_selected_days = days;
		self.$calendar.trigger('days-changed');
	}
	return this;
};

Calendar.prototype.deselectDays = function(days){ // 2012-12-21
	var self = this;

	function deselect(day){
		var $this_day = self.$calendar.find('.Day_'+day),
			$this_weekday = self.$calendar.find('.Week_'+$this_day.data('weekday')),
			$this_month_name = self.$calendar.find('.MonthName'),
			this_year = self.current_month.format('YYYY'),
			this_month_num = self.current_month.format('MM'),
			this_month = self.current_month.format('YYYY.MM'),
			this_weekday_pos;

		self.selected_days.splice(self.selected_days.indexOf($this_day.data('date')), 1);
		self.selected_days.sort();

		if(self.selected_months.indexOf(this_month) !== -1){
			$this_month_name.removeClass(__C.CLASSES.ACTIVE);
			self.selected_months.splice(self.selected_months.indexOf(this_month), 1);
		}

		if(typeof self.selected_weeks[this_year] !== 'undefined'){
			if(typeof self.selected_weeks[this_year][this_month_num] !== 'undefined'){
				this_weekday_pos = self.selected_weeks[this_year][this_month_num].indexOf($this_day.data('weekday'));
				if(this_weekday_pos !== -1){
					$this_weekday.removeClass(__C.CLASSES.ACTIVE);
					self.selected_weeks[this_year][this_month_num].splice(this_weekday_pos, 1);
				}
			}
		}
		self.$calendar.find('.Day_'+day).removeClass(__C.CLASSES.ACTIVE);
	}

	if(this.options.multi_selection === true){
		if(Array.isArray(days)){
			days.forEach(function(day){
				deselect(day);
			});
		} else {
			deselect(days);
		}
		self.last_action = 'deselect';
		self.last_selected_days = days;
		self.$calendar.trigger('days-changed');
	}


	return this;
};

Calendar.prototype.selectWeek = function(week){ // 0..6
	var self = this,
		$this_weekday = self.$calendar.find('.Week_'+week),
		$this_weekday_days = self.$calendar.find('.DayOfWeek_'+week).not('.not_this_month'),
		this_year = self.current_month.format('YYYY'),
		this_month = self.current_month.format('MM'),
		this_weekday_pos,
		days = [];

	$this_weekday_days.each(function(i){
		days.push($this_weekday_days.eq(i).data('date'));
	});

	if(typeof self.selected_weeks[this_year] === 'undefined')
		self.selected_weeks[this_year] = {};
	if(typeof self.selected_weeks[this_year][this_month] === 'undefined')
		self.selected_weeks[this_year][this_month] = [];

	this_weekday_pos = self.selected_weeks[this_year][this_month].indexOf(week);

	if(this_weekday_pos === -1){
		$this_weekday.addClass(__C.CLASSES.ACTIVE);
		self.selectDays(days);
		self.selected_weeks[this_year][this_month].push(week)
	} else {
		$this_weekday.removeClass(__C.CLASSES.ACTIVE);
		self.deselectDays(days);
		self.selected_weeks[this_year][this_month].splice(this_weekday_pos, 1);
	}
	return this;
};

Calendar.prototype.selectMonth = function(month){ // 0..11
	var self = this,
		$this_month_name = self.$calendar.find('.MonthName'),
		$this_month_days = self.$calendar.find('.DayOfMonth_'+month),
		this_month = self.current_month.format('YYYY.MM'),
		this_month_pos = self.selected_months.indexOf(this_month),
		days = [];

	$this_month_days.each(function(i){
		days.push($this_month_days.eq(i).data('date'));
	});

	if(this_month_pos === -1){
		$this_month_name.addClass(__C.CLASSES.ACTIVE);
		self.selectDays(days);
		self.selected_months.push(this_month);
	} else {
		$this_month_name.removeClass(__C.CLASSES.ACTIVE);
		self.deselectDays(days);
		self.selected_months.splice(this_month_pos, 1);
	}
	return this;
};

Calendar.prototype.bindMonthArrows = function(){
	var self = this;
	this.$calendar.find('.NextMonth').on('click', function(){
		self
			.setMonth('next')
			.renderTable();
	});
	this.$calendar.find('.PrevMonth').on('click', function(){
		self
			.setMonth('prev')
			.renderTable();
	});
	return this;
};

Calendar.prototype.bindDaySelection = function(){
	var self = this,
		$days = self.$calendar.find('.'+this.options.classes.td_class).not('.'+this.options.classes.td_disabled);
	$days.on('click', function(){
		if(self.options.multi_selection === true && $(this).hasClass(__C.CLASSES.ACTIVE)){
			self.deselectDays($(this).data('date'));
		} else {
			self.selectDays($(this).data('date'));
		}
	});
	return this;
};

Calendar.prototype.bindWeekdaySelection = function(){
	var self = this,
		$weekdays = self.$calendar.find('.'+this.options.classes.th_class);
	$weekdays.on('click', function(){
		self.selectWeek($(this).data('weekday'));
	});
	return this;
};

Calendar.prototype.bindMonthSelection = function(){
	var self = this,
		$this_month_name = self.$calendar.find('.MonthName');
	$this_month_name.on('click', function(){
		self.selectMonth($(this).data('month'));
	});
	return this;
};

Calendar.prototype.bindDragSelection = function(){
	var self = this;

	function selectDate($target){
		$target = $target.is('.'+self.options.classes.td_class) ? $target : $target.closest('.'+self.options.classes.td_class);
		if($target.not('.'+self.options.classes.td_disabled).length){
			if($target.hasClass(__C.CLASSES.ACTIVE)){
				self.deselectDays($target.data('date'));
			} else {
				self.selectDays($target.data('date'));
			}
		}
	}

	function disableDragSelection(){
		self.$calendar.find('.'+self.options.classes.td_class).off('mouseenter.DragSelection');
	}

	self.$calendar
		.off('mousedown.RangeSelection')
		.on('mousedown.RangeSelection', function(e){
			selectDate($(e.target));
			self.$calendar.find('.'+self.options.classes.td_class).not('.'+self.options.classes.td_disabled).on('mouseenter.DragSelection', function(e){
				e.preventDefault();
				selectDate($(e.target));
			});
		})
		.on('mouseup', disableDragSelection)
		.on('mouseleave', disableDragSelection);
	return this;
};

Calendar.prototype.activateSelectedDays = function(){
	var self = this,
		this_year = self.current_month.format('YYYY'),
		this_month_num = self.current_month.format('MM');

	self.selected_days.forEach(function(day){
		self.$calendar.find('.Day_'+day).addClass(__C.CLASSES.ACTIVE)
	});

	if(self.selected_months.indexOf(this_year + '.' + this_month_num) !== -1){
		self.$calendar.find('.MonthName').addClass(__C.CLASSES.ACTIVE);
	}
	if(typeof self.selected_weeks[this_year] !== 'undefined'){
		if(typeof self.selected_weeks[this_year][this_month_num] !== 'undefined'){
			self.selected_weeks[this_year][this_month_num].forEach(function(weekday) {
				self.$calendar.find('.Week_'+weekday).addClass(__C.CLASSES.ACTIVE);
			});
		}
	}
	return this;
};

Calendar.prototype.init = function(){
	this.$calendar.empty().append(tmpl('calendar', this.options.classes));
	if(this.options.weekday_selection){
		this.$calendar.addClass('-weekday_selection');
	}
	if(this.options.month_selection){
		this.$calendar.addClass('-month_selection');
	}
	this.$calendar.data('calendar', this);
	this.$calendar.data('days', this.selected_days);
	this.$calendar.data('options', this.options);
	this
		.bindMonthArrows()
		.renderTable();
	return this;
};