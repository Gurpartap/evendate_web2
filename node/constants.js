/**
 * Created by kardi on 15.04.2016.
 */

module.exports = {
    AUTH: {
        OAUTH_DONE: 'auth.oauthDone',
        SESSION_SET: 'session.set',

    },
    CONNECTION: {
        DISCONNECT: 'disconnect',
        ERROR: 'error',
    },
    VK_INTEGRATION: {
        GROUPS_TO_POST: 'vk.getGroupsToPost',
        GROUPS_TO_POST_DONE: 'vk.getGroupsToPostDone',
        POST_IT: 'vk.post',
        POST_ERROR: 'vk.post.error'
    },
    NOTIFICATIONS: {
        SEND: 'notifications.send',
        UPDATE_STATS: 'notifications.update_stats',
    },
    UTILS: {
        GET_IMAGE_FROM_URL: 'image.getFromURL',
        UPDATE_IMAGES: 'utils.updateImages',
        UPDATE_IMAGES_DONE: 'utils.updateImagesDone',
        FEEDBACK: 'utils.updateImages'
    },
    getUrls: function (real_config) {
        return {
            "VK": {
                'GET_ACCESS_TOKEN': 'https://oauth.vk.com/access_token?client_id=' +
                real_config.VK.APP_ID +
                '&client_secret=' +
                real_config.VK.SECURE_KEY +
                '&redirect_uri=http://' + real_config.domain + '/vkOauthDone.php?mobile=',
                'GET_FRIENDS_LIST': 'https://api.vk.com/method/friends.get',
                'GET_USER_INFO': 'https://api.vk.com/method/users.get',
                'GET_GROUPS_LIST': 'https://api.vk.com/method/groups.get',
                'GET_GROUPS_PART': '/method/groups.get',
                'POST_TO_WALL': 'https://api.vk.com/method/wall.post',
                'POST_TO_WALL_PART': '/method/wall.post',
                'GET_WALL_PHOTO_UPLOAD_SERVER': 'https://api.vk.com/method/photos.getWallUploadServer',
                'SAVE_WALL_PHOTO_UPLOAD': 'https://api.vk.com/method/photos.saveWallPhoto'
            },
            "GOOGLE": {
                'GET_ACCESS_TOKEN': 'https://www.googleapis.com/oauth2/v1/tokeninfo',
                'GET_USER_INFO': 'https://www.googleapis.com/plus/v1/people/me',
                'GET_FRIENDS_LIST': "https://www.googleapis.com/plus/v1/people/me/people/visible"
            },
            "FACEBOOK": {
                'GET_ACCESS_TOKEN': 'https://graph.facebook.com/v2.3/oauth/access_token?'
                + 'client_id=' + real_config.facebook.app_id
                + '&client_secret=' + real_config.facebook.app_secret
                + '&redirect_uri=http://' + real_config.domain + '/fbOauthDone.php?mobile=',
                'GET_USER_INFO': 'https://graph.facebook.com/me',
                'GET_FRIENDS_LIST': "https://graph.facebook.com/me/friends"
            }
        };
    }
};