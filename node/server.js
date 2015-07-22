

var server = require('http'),
	io = require('socket.io')(server),
	winston = require('winston'),
	rest = require('restler'),
	mysql = require('mysql'),
	_fs = require("fs"),
	moment = require("moment"),
	config = {};

config = _fs.readFileSync('../config.json');
config = JSON.parse(config);


var config_index = process.env.ENV ? process.env.ENV : 'dev';

var real_config = config[config_index],
	connection = mysql.createConnection(real_config.db);
var mess_args = {
	headers: {
	},
	data:{
	}
};
	var URLs = {
		"VK":{
			'GET_ACCESS_TOKEN': 'https://oauth.vk.com/access_token?client_id='+
				real_config.VK.APP_ID+
				'&client_secret=' +
				real_config.VK.SECURE_KEY +
				'&redirect_uri=http://localhost/evendate/vkOauthDone.php&code=',
			'GET_SUBSCRIPTIONS_LIST': 'https://api.vk.com/method/friends.get',
			'GET_USER_INFO': 'https://api.vk.com/method/users.get'
		}
	};


io.on('connection', function (socket){

	socket.on('auth.vkOauthDone', function(oauth_data){

		var friends = [];

		function getAccessToken(data, callback){
			rest
				.get(URLs.VK.GET_ACCESS_TOKEN + data.code, {})
				.on('complete', function(res){
					if (callback instanceof Function){
						callback(res);
					}
				});
		}

		function getUsersInfo(data, callback){
			rest
				.get(URLs.VK.GET_USER_INFO, {
					query:{
						user_ids: data.user_id,
						fields: 'photo_50,photo_100,photo_max_orig',
						name_case: 'nom'
					}
				})
				.on('complete', function(res){
					if (callback instanceof Function){
						res = res.hasOwnProperty('response') ? res.response[0]: null;
						callback(res);
					}
				});
		}

		function getFriendsList(data, callback){
			var FRIENDS_COUNT = 5000;
			rest
				.get(URLs.VK.GET_SUBSCRIPTIONS_LIST, {
					query: {
						order: 'hints',
						user_id: data.uid,
						fields: 'city,domain',
						count: FRIENDS_COUNT
					}
				})
				.on('complete', function(data){
					if (callback instanceof Function){
						var res = data.hasOwnProperty('response') ? data.response : null;
						callback(res);
					}
				});
		}

		function saveDataInDB(data, callback){

			function makeId(){
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for( var i=0; i < 64; i++ ){
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				return text;
			}

			function handleError(err, code){
				console.log(err, code);
			}


			var user_token = data.access_data.access_token + data.access_data.secret + makeId(),
				q_ins_user = 'INSERT INTO users(first_name, last_name, email, token, avatar_url, created_at) ' +
					' VALUES(' +
					connection.escape(data.user_info.first_name) + ', ' +
					connection.escape(data.user_info.last_name) + ', ' +
					connection.escape(data.access_data.email) + ', ' +
					connection.escape(user_token) + ', ' +
					connection.escape(data.user_info.photo_100) + ', ' +
					'NOW()) ' +
						'ON DUPLICATE KEY UPDATE ' +
						'first_name = ' + connection.escape(data.user_info.first_name) + ', ' +
						'last_name = ' + connection.escape(data.user_info.last_name) + ', ' +
						'avatar_url = ' + connection.escape(data.user_info.photo_100) + ', ' +
						'token = ' + connection.escape(user_token);
			/*INSERT IN users TABLE*/
			connection.query(q_ins_user, function(user_err, result){
				if (user_err) return handleError(user_err, 'CANT_INSERT_USER');
				var user_id = result.insertId,
					q_ins_vk_sign_in = 'INSERT INTO vk_sign_in(uid, access_token, expires_in, secret, user_id, photo_50,' +
						'   photo_100, photo_max_orig, created_at) ' +
						'VALUES(' +
						connection.escape(data.access_data.user_id) + ', ' +
						connection.escape(data.access_data.access_token) + ', ' +
						connection.escape(data.access_data.expires_in) + ', ' +
						connection.escape(data.access_data.secret) + ', ' +
						connection.escape(user_id) + ', ' +
						connection.escape(data.user_info.photo_50) + ', ' +
						connection.escape(data.user_info.photo_100) + ', ' +
						connection.escape(data.user_info.photo_orig_max) + ', ' +
						'NOW()) ' +
							'ON DUPLICATE KEY UPDATE ' +
							'access_token = ' + connection.escape(data.access_data.access_token) + ', ' +
							'expires_in = ' + connection.escape(data.access_data.expires_in) + ', ' +
							'photo_50 = ' + connection.escape(data.user_info.photo_50) + ', ' +
							'photo_100 = ' + connection.escape(data.user_info.photo_100) + ', ' +
							'photo_orig_max = ' + connection.escape(data.user_info.photo_orig_max) + ', ' +
							'secret = ' + connection.escape(data.access_data.secret);

				/*INSERT IN vk_sing_in TABLE*/
				connection.query(q_ins_vk_sign_in, function(sign_in_err, result){
					if (user_err) return handleError(sign_in_err, 'CANT_INSERT_SIGN_IN_INFO');


					var created_at = moment().format("YYYY-MM-DD HH:mm:ss"),
						q_ins_friends = "INSERT INTO vk_friends (user_id, friend_uid, created_at) VALUES ? " +
							" ON DUPLICATE KEY UPDATE created_at=NOW()",
						values = [];

					data.friends_data.forEach(function(value){
						values.push([user_id,value.uid,created_at]);
					});
					connection.query(q_ins_friends, [values], function(err){
						if (err) return handleError(err, 'CANT_INSERT_FRIENDS');
						socket.emit('auth', {
							email: data.access_data.email,
							token: user_token
						});
					});
				});
			});
		}

		getAccessToken(oauth_data, function(access_data){
			getUsersInfo(access_data, function(user_info){
				console.log(oauth_data, access_data, user_info);
				getFriendsList(user_info, function(friends_data){
					saveDataInDB({
						oauth_data: oauth_data,
						access_data: access_data,
						user_info: user_info,
						friends_data: friends_data
					}, function(){

					});
				});
			});
		})

	});
});

io.listen(8080);