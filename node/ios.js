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
	connection = mysql.createConnection(real_config.db),
	logger = new (winston.Logger)({
		transports: [
			new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
		],
		exceptionHandlers: [
			new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
		],
		exitOnError: false
	});


var options = {
	"cert": __dirname + '/cert.pem',
	"key":  __dirname + '/key.pem',
	"passphrase": '1P8WhhcARgYMxxJH',
	"gateway": "gateway.sandbox.push.apple.com",
	"port": 2195,
	"enhanced": true,
	production: false,
	"cacheLength": 5,
	errorCallback: function(err){
		console.log("APN Error:", JSON.stringify(err));
		console.log(err);
	}
};

var feedBackOptions = {
	"batchFeedback": true,
	"interval": 300
};

var apnConnection, feedback;

apnConnection = new apn.Connection(options);

feedback = new apn.Feedback(feedBackOptions);
feedback.on("feedback", function(devices) {
	devices.forEach(function(item) {
		console.log(item);
	});
});


var myDevice, note;

myDevice = new apn.Device('ba24455eed3c97f95858712240a92a99dc61e53d86891d1c855d0230994ead6c');
note = new apn.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 1;
note.alert = 'Evendate приветствует тебя!';
note.payload = {'messageFrom': 'Evendate'};

if(apnConnection) {
	apnConnection.pushNotification(note, myDevice);
}

io.on('connection', function (socket){
	socket.on('log', function(data){
		logger.info(arguments);		
		console.log(arguments);
	});


});

io.listen(443);