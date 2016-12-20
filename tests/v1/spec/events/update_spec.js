var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: { 'Authorization': env.token }
    }
});

var create_event = events[0].payload;
var update_event = events[1].payload;

frisby
    .create('Create event for update')
    .post(env.api_url + 'events', create_event, {json: true})
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
        console.log('Added', json);
        var event_id = json.data.event_id;
        frisby
            .create('Update event')
            .put(env.api_url + 'events/' + event_id, update_event, {json: true})
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
                console.log('Updated', json);
            })
            .toss();
    })
    .toss();