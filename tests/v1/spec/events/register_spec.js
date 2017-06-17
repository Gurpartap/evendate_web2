let
    fs = require("fs"),
    path = require('path'),
    events = JSON.parse(fs.readFileSync(path.join(__dirname, './events.json'))),
    register_info = JSON.parse(fs.readFileSync(path.join(__dirname, './register.json'))),
    env = require(path.join(__dirname, '../env.js')),
    frisby = env.frisby;

let approve_statuses = [
    'completed', 'is_pending', 'approved', 'rejected'
];

function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
}

frisby
    .create('Get events with enabled registration')
    .get(env.api_url + 'events' +
        '?fields=registration_till,registration_fields,ticket_types,ticketing_locally,' +
        '&registration_locally=true' +
        '&registration_required=true' +
        '&registered=false' +
        '&order_by=-id,-registration_till&length=5&registration_available=true')
    .expectStatus(200)
    .expectJSONTypes({
        status: Boolean,
        data: Array,
        text: String,
        request_id: String
    })
    .after(function (err, res, body) {
        if (res.statusCode != 200) {
            console.log(body);
        }
        if (err) {
            env.logger.error(err);
        }
    })
    .afterJSON(function (events) {
        events.data.forEach(function (event, index) {
            let send_data = [];
            event.registration_fields.forEach(function (field) {
                let value = '';
                if (register_info.hasOwnProperty(field.type)) {
                    value = register_info[field.type];
                } else if (field.type === 'select') {
                    value = [field.values[getRandom(0, field.values.length)].uuid];
                } else if (field.type === 'select_multi') {
                    let count = getRandom(0, field.values.length);
                    value = [];
                    for (let k =0; k < count; k++){
                        value.push(field.values[getRandom(0, field.values.length)].uuid);
                    }
                }
                send_data.push({uuid: field.uuid, value: value});
            });
            let _send = {registration_fields: send_data, tickets: []};
            if (event.ticketing_locally) {
                _send.tickets.push({uuid: event.ticket_types[0].uuid, count: 1});
            } else {
                _send.tickets.push({count: 1});
            }
            console.log(_send);
            frisby
                .create('Register for event: ' + index)
                .post(env.api_url + 'events/' + event.id + '/orders', _send, {json: true})
                .expectStatus(200)
                .after(function (err, res, body) {
                    if (res.statusCode != 200) {
                        console.log(body);
                    }
                    if (err) {
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

                    console.log(json.data);

                    if (index == 2 || index == 4) {
                        frisby
                            .create('Cancel registration for event: ' + index)
                            .put(env.api_url + 'events/' + event.id + '/orders/' + json.data.order.uuid + '?status=payment_canceled_by_client')
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
                            .toss()
                    } else { // approve registrations
                        frisby
                            .create('Approve registration with UUID: ' + json.data.uuid)
                            .put(env.api_url + 'events/' + event.id + '/orders/' + json.data.order.uuid + '?approved_status=' + approve_statuses[getRandom(0, 4)])
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
                            .toss()
                    }
                })
                .toss();

        })
    })
    .toss();