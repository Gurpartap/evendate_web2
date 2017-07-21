
let fs = require('fs');
let path = require('path');
let Utils = require('../../node/utils');

module.exports = {
    process: function(data, cb){
        let user_avatar_tmpl = fs.readFileSync(path.resolve(__dirname, 'tmpl_user_avatar.html'), {encoding: 'utf8'});
        data.users_avatars = '';
        if (data.hasOwnProperty('subscribed')){
            data.subscribed.forEach(user => {
                data.users_avatars += Utils.replaceTags(user_avatar_tmpl, user);
            });
        }
        if (data.hasOwnProperty('main_stats')){
            data.page_views = data.main_stats.view[data.main_stats.view.length - 1].value;
            data.favored_count = data.main_stats.fave[data.main_stats.view.length - 1].value;
        }
        if (!data.page_views) data.page_views = 0;
        if (!data.favored_count) data.favored_count = 0;
        return cb(data);
    }
};