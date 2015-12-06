

var apn = require('apn'),
	Pushwoosh = require('pushwoosh-client'),
	client, gcm,
	GCM = require('gcm').GCM;



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
	client = new Pushwoosh(settings.APN.pushwoosh.app_code, settings.APN.pushwoosh.app_token);
	apnConnection = new apn.Connection(settings.APN);
	gcm = new GCM(settings.GCM.api_key),

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
			case DEVICE_TYPES.ANDROID: {
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
				note['data.message'] = note.body;
				note['data.event_id'] = note.payload.event_id;
				return note
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
		client.sendMessage(note.alert, device, {data: note.payload}, function(error, response) {
			if (error) {
				console.log('Some error occurs: ', error);
			}
			console.log('Pushwoosh API response is', response);
		});
	}

	function sendToGCM(device, note){
		//if(apnConnection){
		//	apnConnection.pushNotification(note, device);
		//}else{
		//	console.log('false');
		//}
		note.registration_id = device;
		gcm.send(note, function(err, messageId){
			if (err) {
				console.log(err);
			} else {
				console.log("Sent with message ID: ", messageId);
			}
		});
	}

	Notification.prototype.send = function(){
		switch (this.type){
			case DEVICE_TYPES.IOS:{
				return sendToAPN(this.device, this.note);
			}
			case DEVICE_TYPES.ANDROID:{
				return sendToGCM(this.device, this.note);
			}
		}

	};

	return new Notification(notification);
};

module.exports = NotificationsManager;