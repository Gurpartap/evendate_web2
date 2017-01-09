/**
 * Created by Инал on 13.09.2015.
 */

var server = require('http'),
	io = require('socket.io')(server);

io.on('connection', function (socket){
	socket.on('log', function(data){
		console.log(arguments);
	});
});

io.listen(443);