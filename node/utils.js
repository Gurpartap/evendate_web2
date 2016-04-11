/**
 * Created by ���� on 25.12.2015.
 */

var mime = require('mime-types');

module.exports = {
	replaceTags: function (text, object){
		for (var key in object){
			if (object.hasOwnProperty(key)){
				var value = object[key];
				var key_expr = new RegExp('{'+key+'}', 'gim');
				if (value == null){
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
			if (a.hasOwnProperty(k)){
				diff.push(k);
			}
		}
		return diff;
	},
	makeId: function (length){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		length = length ? length : 32;
		for( var i=0; i < length; i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
	composeFullInfoObject: function (data){
		switch (data.type){
			case 'vk': {
				return data;
			}
			case 'google': {
				data.access_data.access_token = data.oauth_data.access_token;
				data.access_data.secret = '';
				data.access_data.email = data.user_info.emails[0].value;
				data.user_info.first_name = data.user_info.name.givenName;
				data.user_info.last_name = data.user_info.name.familyName;
				data.user_info.photo_100 = data.user_info.image.url;
				return data;
			}
			case 'facebook': {
				data.access_data.email = data.user_info.email;
				return data;
			}
		}
	},
	downloadImageFromUrl: function(request, url, callback){
		var _this = this;
		request({url: url, encoding: null}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64'),
					filename = _this.makeId() + '.' + mime.extension(response.headers["content-type"]);
				callback(null, data, filename);
			}else{
				callback(error);
			}
		});
	}
};