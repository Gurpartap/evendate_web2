

var apn = require('apn'),
	Pushwoosh = require('pushwoosh-client'),
	client;



var feedBackOptions = {
	"batchFeedback": true,
	"interval": 300
};

var apnConnection,
	feedback,
	DEVICE_TYPES = {
		IOS: 'ios',
		ANDROID: 'android'
	};


function NotificationsManager(settings) {
	this.settings = settings;
	client = new Pushwoosh(settings.pushwoosh.app_code, settings.pushwoosh.app_token);
	apnConnection = new apn.Connection(settings);
	feedback = new apn.Feedback(feedBackOptions);
	feedback.on('feedback', function(devices) {
		devices.forEach(function(item) {
			console.log(item);
		});
	});
}


NotificationsManager.prototype.create = function(notification){


	function Notification(data){
		this.device = getDeviceInstance(data.device);
		this.note = getNote(data.device.client_type, data.note);
		this.note.expiry = Math.floor(Date.now() / 1000) + 86400; // Expires 1 hour from now.
		this.note.alert = notification.note.alert;
		this.note.payload = notification.note.payload;
		this.type = data.device.client_type;
	}

	function getDeviceInstance(device){
		switch (device.client_type){
			case DEVICE_TYPES.IOS: {
				//return new apn.Device(device.device_token);
				return device.device_token;
			}
			default :{
				throw new Error('Cant find device');
			}
		}
	}

	function getNote(client_type, note){
		switch (client_type){
			case DEVICE_TYPES.IOS: {
				//return new apn.Notification();
				return {};
			}
			case DEVICE_TYPES.ANDROID: {
				return note;
			}
			default :{
				throw new Error('Cant find type');
			}
		}
	}

	function sendToAPN(device, note){
		//if(apnConnection){
		//	apnConnection.pushNotification(note, device);
		//}else{
		//	console.log('false');
		//}
		console.log(note.alert, device, {data: note.payload});
		client.sendMessage(note.alert, device, {data: note.payload}, function(error, response) {
			if (error) {
				console.log('Some error occurs: ', error);
			}
			console.log('Pushwoosh API response is', response);
		});
	}

	Notification.prototype.send = function(){
		switch (this.type){
			case DEVICE_TYPES.IOS:{
				return sendToAPN(this.device, this.note);
			}
		}

	};

	return new Notification(notification);
};

module.exports = NotificationsManager;