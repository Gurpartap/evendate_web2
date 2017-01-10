var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    organizations = JSON.parse(fs.readFileSync(path.join(__dirname, './organizations.json'))),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: {'Authorization': env.token}
    }
});

frisby
    .create('Get organizations with role admin')
    .get(env.api_url + 'organizations?roles=admin&fields=is_private')
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
        json.data.forEach((organization) => {
            if (organization.is_private == false) return true;
            frisby
                .create('Generate invitation link')
                .post(env.api_url + 'organizations/' + organization.id +'/invitations/links')
                .expectStatus(200)
                .expectJSONTypes({
                    request_id: String,
                    data: Object,
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
                })
                .toss();
        });
    })
    .toss();