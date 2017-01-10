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
    .afterJSON(function (json) {
        json.data.forEach(organization => {
            if (organization.is_private) {
                frisby
                    .create('Get invitations')
                    .get(env.api_url + 'organizations/' + organization.id + '/invitations/')
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
                        json.data.users.forEach(invitation => {
                            frisby
                                .create('Remove invitation: ' + invitation.uuid)
                                .delete(env.api_url + 'organizations/' + organization.id + '/invitations/users/' + invitation.uuid)
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
                                .toss();
                        });
                        json.data.links.forEach(invitation => {
                            frisby
                                .create('Remove invitation: ' + invitation.uuid)
                                .delete(env.api_url + 'organizations/' + organization.id + '/invitations/links/' + invitation.uuid)
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
                                .afterJSON(res => {
                                    console.log(res);
                                })
                                .toss();
                        })
                    })
                    .toss();

            }
        })
    })
    .toss();


