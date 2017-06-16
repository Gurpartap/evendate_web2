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
        events.forEach(function (value, index) {
            if (value.payload) {
                if (index == 0) {
                    value.payload.vk.description = value.payload.description;
                    value.payload.vk.image = value.payload.image_horizontal;

                }
                value.payload.organization_id = 146;//json.data[index].id;
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

        // test vk integration

        let value = events[0];
        value.payload.vk_post = true;
        value.payload.organization_id = 146;//json.data[index].id;
        frisby
            .create('Create event for vk cross-post ')
            .post(env.api_url + 'events', value.payload, {json: true})
            .addHeader('Authorization', 'ad5305acba807d19a7b32fb008d3ab8277763376f3067540b79598c33ccbbfa092061b697629686c2b90e')
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
    })
    .toss();