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

var update_event = events[1].payload;

frisby
    .create('Create event for update')
    .post(env.api_url + 'events', update_event, {json: true})
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
        data: {
            event_id: Number
        },
        status: Boolean,
        text: String
    })
    .afterJSON(function (json) {
        var event_id = json.data.event_id,
            fields = {}, field_names = [];
        for (var key in env.api_docs.definitions.Event.properties) {
            if (env.api_docs.definitions.Event.properties.hasOwnProperty(key) == false) continue;
            property = env.api_docs.definitions.Event.properties[key];
            if (key.indexOf('[') != -1) {
                key = key.replace('[', '').replace(']', '');
            }
            field_names.push(key);
            var type;
            switch (property.type) {
                case 'number':
                case 'integer': {
                    type = Number;
                    break;
                }
                case 'string': {
                    type = String;
                    break;
                }
                case 'boolean': {
                    type = Boolean;
                    break;
                }
                case 'array': {
                    type = Array;
                    break;
                }
                default: {
                    continue;
                }
            }
            fields[key] = type;
        }

        frisby
            .create('Get one event')
            .get(env.api_url + 'events/' + event_id + '?fields=' + field_names.join(','))
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
                data: function(data){
                    for(let key in fields){
                        if (fields.hasOwnProperty(key) == false) continue;
                        expect(data[key]).toBeTypeOrNull(fields[key]);
                    }
                },
                status: Boolean,
                text: String
            })
            .toss();
    })
    .toss();