/**
 * Created by ���� on 25.12.2015.
 */

var mime = require('mime-types'),
    request = require('request'),
    fs = require('fs');

function setNullToUndefined(obj, key){
    if (obj.hasOwnProperty(key) == false){
        obj[key] = null;
    }
    return obj;
}

module.exports = {
    replaceTags: function (text, object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var value = object[key];
                var key_expr = new RegExp('{' + key + '}', 'gim');
                if (value == null) {
                    value = '';
                }
                text = text ? text.replace(key_expr, value) : '';
            }
        }
        var not_handled_keys = new RegExp(/\{.*?\}/gim);
        text = text ? text.replace(not_handled_keys, '') : '';
        return text;
    },
    lowerCaseFirstLetter: function (string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    },
    getArrayDiff: function (a1, a2) {
        var a = [], diff = [];
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
        for (i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                diff.push(k);
            }
        }
        return diff;
    },
    makeId: function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        length = length ? length : 32;
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    composeFullInfoObject: function (data) {
        data.user_info = setNullToUndefined(data.user_info, 'university');
        data.user_info = setNullToUndefined(data.user_info, 'university_name');
        data.user_info = setNullToUndefined(data.user_info, 'faculty');
        data.user_info = setNullToUndefined(data.user_info, 'faculty_name');
        data.user_info = setNullToUndefined(data.user_info, 'graduation');
        data.user_info = setNullToUndefined(data.user_info, 'relation');
        data.user_info = setNullToUndefined(data.user_info, 'interests');
        data.user_info = setNullToUndefined(data.user_info, 'movies');
        data.user_info = setNullToUndefined(data.user_info, 'tv');
        data.user_info = setNullToUndefined(data.user_info, 'books');
        data.user_info = setNullToUndefined(data.user_info, 'games');
        data.user_info = setNullToUndefined(data.user_info, 'about');
        data.user_info = setNullToUndefined(data.user_info, 'city');

        if (data.user_info.hasOwnProperty('occupation') == false){
            data.user_info.occupation = {};
        }
        data.user_info.occupation = setNullToUndefined(data.user_info.occupation, 'type');
        data.user_info.occupation = setNullToUndefined(data.user_info.occupation, 'id');
        data.user_info.occupation = setNullToUndefined(data.user_info.occupation, 'name');

        if (data.user_info.hasOwnProperty('personal') == false){
            data.user_info.personal = {};
        }
        data.user_info.personal = setNullToUndefined(data.user_info.personal, 'political');
        data.user_info.personal = setNullToUndefined(data.user_info.personal, 'smoking');
        data.user_info.personal = setNullToUndefined(data.user_info.personal, 'alcohol');

        
        switch (data.type) {
            case 'facebook':
            case 'vk':
            {
                return data;
            }
            case 'google':
            {
                data.user_info.first_name = data.user_info.name.givenName;
                data.user_info.last_name = data.user_info.name.familyName;
                data.user_info.photo_100 = data.user_info.image.url;
                return data;
            }
        }
    },
    downloadImageFromUrl: function (url, callback, save_path) {
        var _this = this;
        request({url: url, encoding: null}, function (error, response, body) {
            if (error) {
                callback(error, null, null);
                return;
            }
            if (response.statusCode != 200) {
                callback('Удаленный сервер вернул ошибку: ' + response.statusCode, null, null);
                return;
            }
            var filename = _this.makeId() + '.' + mime.extension(response.headers["content-type"]);

            if (save_path) {
                request(url).pipe(fs.createWriteStream(save_path + filename)).on('close', function () {
                    callback(null, null, filename);
                });
            } else {
                var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                callback(null, data, filename);
            }
        });
    }
};