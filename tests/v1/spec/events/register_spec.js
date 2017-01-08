var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    register_info = JSON.parse(fs.readFileSync(path.join(__dirname, './register.json'))),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: {'Authorization': env.token}
    }
});

frisby
    .create('Get events with enabled registration')
    .get(env.api_url + 'events' +
        '?fields=registration_till,registration_fields' +
        '&registration_locally=true' +
        '&registration_required=true' +
        '&registered=false' +
        '&order_by=-id,-registration_till&length=5')
    .expectStatus(200)
    .expectJSONTypes({
        status: Boolean,
        data: Array,
        text: String,
        request_id: String
    })
    .afterJSON(function (events) {
        events.data.forEach(function (event, index) {
            var send_data = [];
            event.registration_fields.forEach(function (field) {
                var value = '';
                if (register_info.hasOwnProperty(field.type)) {
                    value = register_info[field.type];
                }
                send_data.push({uuid: field.uuid, value: value});
            });
            frisby
                .create('Register for event: ' + index)
                .post(env.api_url + 'events/' + event.id + '/registration', {registration_fields: send_data}, {json: true})
                .expectStatus(200)
                .expectJSONTypes({
                    request_id: String,
                    data: Array,
                    status: Boolean,
                    text: String
                })
                .afterJSON(function (json) {
                    env.logger.log(json);

                    if (index == 2 || index == 4) {
                        frisby
                            .create('Cancel registration for event: ' + index)
                            .put(env.api_url + 'events/' + event.id + '/registration?status=false')
                            .expectStatus(200)
                            .expectJSONTypes({
                                request_id: String,
                                data: Array,
                                status: Boolean,
                                text: String
                            })
                            .afterJSON(function (res) {
                                console.log(res);
                            })
                            .toss()
                    }
                })
                .toss();

        })
    })
    .toss();