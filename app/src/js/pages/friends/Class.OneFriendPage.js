/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} friend_id
 */
function OneFriendPage(friend_id) {
	Page.apply(this);
	
	this.wrapper_tmpl = 'friends';
	this.friend_id = friend_id;
}
OneFriendPage.extend(Page);

OneFriendPage.prototype.render = function() {
	var $view = this.$view,
		friend_id = this.friend_id,
		$content = $view.find('.one-friend-main-content'),
		page_number = 0;
	
	
	if(__APP.USER.id === -1){
		$view.find('.friends-right-bar').remove();
		$view.find('.back-to-friends-list').remove();
	} else {
		getFriendsList($view.find('.friends-right-bar'), function() {
			$('.friend-item.friend-' + friend_id).addClass(__C.CLASSES.ACTIVE).siblings().removeClass(__C.CLASSES.ACTIVE);
		});
	}
	
	$view.find('.friends-main-content').addClass(__C.CLASSES.HIDDEN);
	$content.removeClass(__C.CLASSES.HIDDEN).empty();
	
	function getFriendFeed() {
		var $load_btn = $content.find('.load-more-btn');
		if (page_number == 0) {
			$content.find('.friend-events-block').remove();
		}
		$.ajax({
			url: '/api/v1/users/' + friend_id + '/actions?fields=entity,created_at,user,type_code,event{fields:"organization_logo_small_url,image_square_vertical_url,organization_short_name"},organization{fields:"subscribed_count,img_medium_url"}&&order_by=-created_at&length=10&offset=' + (10 * page_number++),
			success: function(res) {
				var hide_btn = false;
				if ((res.data.length == 0 && page_number != 1) || (res.data.length < 10 && res.data.length > 0)) {
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					hide_btn = true;
				} else if (res.data.length == 0 && page_number == 1) {
					$load_btn.before(tmpl('no-activity', {}));
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					hide_btn = true;
				}
				var cards_by_users = {};
				res.data.forEach(function(stat) {
					var date = moment.unix(stat.created_at),
						ent = stat[stat.entity],
						key = [stat.entity, stat.stat_type_id, stat.user.id, date.format('DD.MM')].join('-');
					if (cards_by_users.hasOwnProperty(key) == false) {
						cards_by_users[key] = {
							user: stat.user,
							entity: stat.entity,
							type_code: stat.type_code,
							date: date.format(__C.DATE_FORMAT) == moment().format(__C.DATE_FORMAT) ? 'Сегодня' : date.format('DD.MM'),
							action_name: __C.ACTION_NAMES[stat.type_code][0].capitalize(),
							first_name: stat.user.first_name,
							avatar_url: stat.user.avatar_url,
							friend_id: stat.user.id,
							last_name: stat.user.last_name,
							entities: []
						};
					}
					
					cards_by_users[key].entities.push(ent);
				});
				
				$.each(cards_by_users, function(key, value) {
					var $card = tmpl('friends-feed-card-short', value),
						item_tmpl_name = value.entity == __C.ENTITIES.EVENT ? 'friends-feed-event' : 'friends-feed-organization';
					
					value.entities.forEach(function(ent) {
						$card.append(tmpl(item_tmpl_name, ent));
					});
					$load_btn.before($card);
				});
				if (!hide_btn) {
					$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				}
				$load_btn.off('click').on('click', getFriendFeed);
				bindPageLinks($view);
			}
		});
	}
	
	$.ajax({
		url: '/api/v1/users/' + friend_id + '?fields=subscriptions',
		success: function(res) {
			$content.append(tmpl('friends-page-header', res.data[0]));
			__APP.changeTitle(res.data[0].first_name + ' ' + res.data[0].last_name);
			$content.find('.friend-user-link').on('click', function() {
				window.open(res.data[0].link, '_blank');
			});
			
			if (res.data[0].subscriptions.length == 0) {
				tmpl('no-subscriptions', {}, $content.find('.one-friend-subscriptions'));
			} else {
				tmpl('friends-subscription', res.data[0].subscriptions, $content.find('.one-friend-subscriptions'))
			}
			
			
			$content.find('.friend-subscription-block').each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					$this.fadeIn(300);
				}, index * 40 + 500);
			});
			$content.find('.user-btn').on('click', function() {
				var $this = $(this);
				$this.addClass(__C.CLASSES.ACTIVE);
				$this.siblings().removeClass(__C.CLASSES.ACTIVE);
				$content.find('.' + $this.data('tab'))
					.removeClass(__C.CLASSES.HIDDEN)
					.siblings()
					.addClass(__C.CLASSES.HIDDEN);
			});
			
			if(__APP.USER.id === -1){
				$view.find('.back-to-friends-list').remove();
			} else {
				$view.find('.back-to-friends-list').on('click', function() {
					__APP.changeState('/friends');
				});
			}
			getFriendFeed();
		}
	});
};