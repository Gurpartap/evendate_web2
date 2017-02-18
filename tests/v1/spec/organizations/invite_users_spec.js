var
    fs = require("fs"),
    path = require('path'),
    organizations = JSON.parse(fs.readFileSync(path.join(__dirname, './organizations.json'))),
    env = require(path.join(__dirname, '../env.js')),
    frisby = env.frisby;

frisby.globalSetup({
    request: {
        headers: {'Authorization': env.token}
    }
});

var users = [
    {
        email: 'kardanovir@evendate.ru',
    },
    {
        email: 'test@evendate.ru',
    },
    {
        user_id: 714
    },
    {
        user_id: 23
    },
    {
        user_id: 14
    }
];


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
                users.forEach(user => {

                    frisby
                        .create('Invite user: ' + JSON.stringify(user))
                        .post(env.api_url + 'organizations/' + organization.id + '/invitations/users', user)
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
                        .toss();

                });
            }
        });
    })
    .toss();