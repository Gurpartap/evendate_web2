var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: {'Authorization': env.token}
    }
});

frisby
    .create('Get organizations to add')
    .get(env.api_url + 'organizations?roles=admin&order_by=-id')
    .expectStatus(200)
    .expectJSONTypes({
        request_id: String,
        data: Array,
        status: Boolean,
        text: String
    })
    .after(function (err, res, body) {
        if (res.statusCode != 200) {
            console.log(body);
        }
        if (err) {
            env.logger.error(err);
        }
    })
    .afterJSON(json => {
        events.forEach(function (value, index) {
            if (value.payload) {
                value.payload.organization_id = json.data[index].id;
                frisby
                    .create('Create event: ' + index)
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
                    .after(function (err, res, body) {
                        if (res.statusCode != 200) {
                            console.log(body);
                        }
                        if (err) {
                            env.logger.error(err);
                        }
                    })
                    .toss();
            }
        });
    })
    .toss();