var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    organizations = JSON.parse(fs.readFileSync(path.join(__dirname, './organizations.json'))),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: { 'Authorization': env.token }
    }
});

organizations.forEach(function (value, index) {
    if (value.payload) {

        frisby
            .create('Create organization: ' + index)
            .post(env.api_url + 'organizations', value.payload, {json: true})
            .expectStatus(200)
            .expectJSONTypes({
                request_id: String,
                data: {
                    organization_id: Number
                },
                status: Boolean,
                text: String
            })
            .after(function (err, res, body) {
                if (res.statusCode != 200){
                    console.log(body);
                }
                if (err){
                    env.logger.error(err);
                }

                if (value.payload.private)
            })
            .toss();
    }
});