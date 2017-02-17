var
    fs = require("fs"),
    path = require('path'),
    organizations = JSON.parse(fs.readFileSync(path.join(__dirname, './organizations.json'))),
    env = require(path.join(__dirname, '../env.js')),
    frisby = env.frisby;

frisby.globalSetup({
    request: {
        headers: { 'Authorization': env.token }
    }
});

var create_organization = organizations[0].payload;
var update_organization = organizations[1].payload;

frisby
    .create('Create organization for update')
    .post(env.api_url + 'organizations', create_organization, {json: true})
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
            organization_id: Number
        },
        status: Boolean,
        text: String
    })
    .afterJSON(function (json) {
        var organization_id = json.data.organization_id;
        frisby
            .create('Update organization')
            .put(env.api_url + 'organizations/' + organization_id, update_organization, {json: true})
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
                    organization_id: Number
                },
                status: Boolean,
                text: String
            })
            .toss();
    })
    .toss();