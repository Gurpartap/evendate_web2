/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 */
function FriendsPage() {
	Page.apply(this);
	
	this.wrapper_tmpl = 'friends';
	this.page_title = 'Друзья';
}
FriendsPage.extend(Page);

FriendsPage.prototype.render = function() {
	var $view = this.$view,
		page_number = 0;
	
	function getFeed() {
		if (page_number == 0) {
			$view.find('.friend-events-block').remove();
		}
		$.ajax({
			url: '/api/v1/users/feed?fields=entity,created_at,user,type_code,event{fields:"organization_logo_small_url,image_square_vertical_url,organization_short_name"},organization{fields:"subscribed_count,img_medium_url"}&&order_by=-created_at&length=10&offset=' + (10 * page_number++),
			success: function(res) {
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
							action_name: __C.ACTION_NAMES[stat.type_code][0],
							first_name: stat.user.first_name,
							friend_id: stat.user.id,
							avatar_url: stat.user.avatar_url,
							last_name: stat.user.last_name,
							entities: []
						};
					}
					cards_by_users[key].entities.push(ent);
				});
				
				$.each(cards_by_users, function(key, value) {
					var $card = tmpl('friends-feed-card', value),
						item_tmpl_name = value.entity == __C.ENTITIES.EVENT ? 'friends-feed-event' : 'friends-feed-organization';
					
					value.entities.forEach(function(ent) {
						$card.append(tmpl(item_tmpl_name, ent));
					});
					$load_btn.before($card);
				});
				$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				bindPageLinks($view);
			}
		});
	}
	
	if(__APP.USER.id === -1){
		__APP.changeState('/feed/');
	} else {
		var $main_content = $view.find('.friends-main-content').removeClass(__C.CLASSES.HIDDEN),
			$friends_right_list = $view.find('.friends-right-bar'),
			$load_btn = $view.find('.load-more-btn').addClass(__C.CLASSES.HIDDEN),
			$user_content = $view.find('.one-friend-main-content').addClass(__C.CLASSES.HIDDEN);
		
		
		getFriendsList($friends_right_list, function(res) {});
		$load_btn.find('.btn').on('click', getFeed);
		getFeed();
	}
};