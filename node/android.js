var message = {
	registration_id: 'esr7v46zW6I:APA91bGAJt08fB-L-fSqE3DzjgiwQrJrRyIwxqZRsiySPJWWQ1Y8YKoGuFklWsSHdhKp1-YqWN2TJHZp-s89KqcHwV5CkHRVp7aKpCFCj0vdinPCfGIUfGFR1TgTOqh3zTAqpuN80BdL', // required
	collapse_key: '',
	'data.key1': 'value123',
	'data.key2': 'value243'
};

gcm.send(message, function(err, messageId){
	if (err) {
		console.log(err);
	} else {
		console.log("Sent with message ID: ", messageId);
	}
});