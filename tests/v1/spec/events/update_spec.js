let
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    env = require(path.join(__dirname, '../env.js')),
    frisby = env.frisby;

frisby.globalSetup({
    request: {
        headers: { 'Authorization': env.token }
    }
});

let create_event = events[0].payload;
let update_event = events[1].payload;

frisby
    .create('Create event for update')
    .post(env.api_url + 'events', create_event, {json: true})
    .expectStatus(200)
    .after(function (err, res, body) {
        if (res.statusCode != 200){
            console.log(body);
        }
        if (err){
            env.logger.error(err);
        }
    })
    .expectJSONTypes({
        request_id: String,
        data: Object,
        status: Boolean,
        text: String
    })
    .afterJSON(function (json) {
        let event_id = json.data.event_id;
        frisby
            .create('Update event')
            .put(env.api_url + 'events/' + event_id, update_event, {json: true})
            .expectStatus(200)
            .after(function (err, res, body) {
                if (res.statusCode != 200){
                    console.log(body);
                }
                if (err){
                    env.logger.error(err);
                }
            })
            .expectJSONTypes({
                request_id: String,
                data: Object,
                status: Boolean,
                text: String
            })
            .toss();
    })
    .toss();