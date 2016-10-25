/**
 *
 * @constructor
 * @augments jQuery
 * @param {(number|string)} id
 * @param {boolean} is_subscribed
 * @param {object} options
 */
function ActionButton(id, is_subscribed, options) {
	var self = this;
	this.classes = $.extend(true, {subscribed_state: ''}, this.classes);
	this.options = $.extend(true, this.options, options);
	this.options.classes = this.options.classes ? this.options.classes : [];
	this.states.forEach(function(state) {
		self.classes[state] = [];
		self.options.icons ? self.classes[state].push(self.options.icons[state]) : false;
		self.options.colors ? self.classes[state].push(self.options.colors[state]) : false;
		self.classes[state] = self.classes[state].join(' ');
	});
	this.is_subscribed = is_subscribed;
	this.id = id;
	jQuery.fn.init.call(this, __APP.BUILD.button({
		classes: (
			self.is_subscribed ?
				self.options.classes.concat(self.classes.subscribed).concat(self.classes.subscribed_state) :
				self.options.classes.concat(self.classes.subscribe)
		).concat('fa_icon'),
		title: self.is_subscribed ? self.options.labels.subscribed : self.options.labels.subscribe
	}));
	this.initiate();
}
ActionButton.extend(jQuery);
ActionButton.prototype.states = ['subscribe', 'unsubscribe', 'subscribed'];
ActionButton.prototype.pushStack = function(elems) {
	var ret = jQuery.merge(this.get(0) == elems ? new this.constructor(this.id, this.is_subscribed, this.options) : $(), elems);
	ret.prevObject = this;
	ret.context = this.context;
	return ret;
};
ActionButton.prototype.bindHoverEffects = function() {
	var self = this;
	this
		.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed')
		.on('mouseenter.hoverSubscribed', function() {
			self.removeClass(self.classes.subscribed).addClass(self.classes.unsubscribe);
			self.children('.Text').text(self.options.labels.unsubscribe);
		})
		.on('mouseleave.hoverSubscribed', function() {
			self.removeClass(self.classes.unsubscribe).addClass(self.classes.subscribed);
			self.children('.Text').text(self.options.labels.subscribed);
		});
};
/**
 * @interface
 */
ActionButton.prototype.bindClick = function() {};
ActionButton.prototype.afterSubscribe = function() {
	this.removeClass([this.classes.subscribe, this.classes.subscribed].join(' '));
	this.addClass([this.classes.subscribed_state, this.classes.unsubscribe].join(' '));
	this.children('.Text').text(this.options.labels.unsubscribe);
	this.is_subscribed = true;
	this.bindHoverEffects();
};
ActionButton.prototype.afterUnsubscribe = function() {
	this.removeClass([this.classes.subscribed_state, this.classes.unsubscribe, this.classes.subscribed].join(' '));
	this.addClass(this.classes.subscribe);
	this.children('.Text').text(this.options.labels.subscribe);
	this.is_subscribed = false;
	this.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed');
};
ActionButton.prototype.initiate = function() {
	if (this.is_subscribed) {
		this.bindHoverEffects();
	}
	this.bindClick();
};