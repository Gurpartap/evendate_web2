var
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    env = require(path.join(__dirname, '../env.js')),
    frisby = env.frisby;

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
        console.log(json);
        events.forEach(function (value, index) {
            if (value.payload) {
                if (index == 0) {
                    value.payload.vk.description = value.payload.description;
                    value.payload.vk.image = value.payload.image_horizontal;

                }
                value.payload.organization_id = 146;//json.data[index].id;
                console.log(env.api_url + 'events');
                frisby
                    .create('Create event: ' + index)
                    .post(env.api_url + 'events', value.payload, {json: true})
                    .expectStatus(200)
                    .expectJSONTypes({
                        request_id: String,
                        data: Object,
                        status: Boolean,
                        text: String
                    })
                    .after(function (err, res, body) {
                        console.log(body);
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