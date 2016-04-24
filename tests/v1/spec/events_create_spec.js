var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    env = require(path.join(__dirname, './env.js')).module;

frisby.globalSetup({
    request: {
        headers: { 'Authorization': env.test.token }
    }
});

events.forEach(function (value) {
    if (value.payload) {
        
        frisby
            .create('Create event')
            .post(env.api_url + 'events', value.payload, {json: true})
            .expectStatus(200)
            .expectJSONTypes({
                request_id: String,
                data: {
                    event_id: Number
                },
                status: Boolean,
                text: String
            })
            .afterJSON(function (json) {
                console.log(json);
            })
            .after(function(err, res, body){
                console.log(err);
            })
            .toss();
    }
});