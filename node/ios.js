/**
 * Created by Инал on 13.09.2015.
 */


var server = require('http'),
	io = require('socket.io')(server),
	winston = require('winston'),
	rest = require('restler'),
	mysql = require('mysql'),
	_fs = require("fs"),
	moment = require("moment"),
	apn = require('apn'),
	config = {};

config = _fs.readFileSync('../config.json');
config = JSON.parse(config);

var config_index = process.env.ENV ? process.env.ENV : 'dev',
	real_config = config[config_index],
	connection = mysql.createPool(real_config.db),
	logger = new (winston.Logger)({
		transports: [
			new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
		],
		exceptionHandlers: [
			new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
		],
		exitOnError: false
	});

//
//var options = {
//	"cert": __dirname + '/pushcert.pem',
//	"key":  __dirname + '/pushkey.pem',
//	"passphrase": 'maryashka2004',
//	"gateway": "gateway.push.apple.com",
//	"port": 2195,
//	"enhanced": true,
//	production: false,
//	"cacheLength": 5,
//	errorCallback: function(err){
//		console.log("APN Error:", JSON.stringify(err));
//		console.log(err);
//	}
//};

//var feedBackOptions = {
//	"batchFeedback": true,
//	"interval": 300
//};
////
//var apnConnection,
//	feedback,
//	q_get_devices = 'SELECT * ' +
//		' FROM tokens ' +
//		' WHERE ' +
//		'   client_type="ios" ' +
//		'   AND device_token IS NOT NULL';
//
//apnConnection = new apn.Connection(options);
//
//feedback = new apn.Feedback(feedBackOptions);
//feedback.on("feedback", function(devices) {
//	devices.forEach(function(item) {
//		logger.log(item);
//	});
//});
//
//
//
//connection.query(q_get_devices, function(err, devices){
//
//	devices.forEach(function(device){
//		var myDevice = new apn.Device(device.device_token),
//			note = new apn.Notification();
//
//
//		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
//		note.alert = 'Событие прилетело!';
//		note.payload = {type: 'event_notification', event_id: 660};
//
//		if(apnConnection){
//			console.log('TRUE');
//			apnConnection.pushNotification(note, myDevice);
//		}else{
//			console.log('false');
//		}
//	});
//});

io.on('connection', function (socket){
	socket.on('log', function(data){
		//logger.info(arguments);
		console.log(arguments);
	});
});

io.listen(443);