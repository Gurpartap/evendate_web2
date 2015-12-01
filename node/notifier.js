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
			new winston.transports.File({ filename: __dirname + '/notifierdebug.log', json: false })
		],
		exceptionHandlers: [
			new winston.transports.File({ filename: __dirname + '/notifierexceptions.log', json: false })
		],
		exitOnError: false
	});


try {
	new CronJob('*/10 * * * *', function(){
		connection.query('SELECT events.* ' +
			' FROM events ' +
			' INNER JOIN events_dates ON events.id = events_dates.event_id' +
			' WHERE status = 1' +
			' AND (' +
			'       NOW() BETWEEN event_start_date AND event_end_date' +
			'       OR ' +
			'       DATE(NOW()) = events_dates.event_date' +
			')');
	}, null, true);
} catch(ex) {
	logger.error("CRON ERROR","cron pattern not valid");
}