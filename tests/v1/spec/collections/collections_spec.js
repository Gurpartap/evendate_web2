/**
 * Created by kardi on 22.04.2016.
 */

var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    _ = require('lodash'),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: {'Authorization': env.test.token}
    }
});

var collections_operation_ids = {
    'unauthorized': ['getOrganizations', 'getOrganizationTypes', 'getTags', 'getEvents','getUsers'],
    'authorized': ['getOrganizationsRecommendations', 'getSubscriptions', 'getEventsRecommendations',
        'getMyEvents', 'getFavoriteEvents', 'getFriendsFeed', 'getFriends', 'loginUser', 'getUserDevices',
        'getUserSettings']
};

_.forEach(env.api_docs.paths, function (path, key) {
    if (path.hasOwnProperty('get')) {

        if (collections_operation_ids.authorized.indexOf(path.get.operationId) == -1 &&
            collections_operation_ids.unauthorized.indexOf(path.get.operationId) == -1) return true;

        var unauthorized = collections_operation_ids.unauthorized.indexOf(path.get.operationId) != -1;

        frisby.create(path.get.summary)
            .addHeader('Authorization', env.token)
            .get(env.api_url + key)
            .after(function (err, res, body) {
                if (res.statusCode != 200){
                    console.log(body);
                }
                if (err){
                    env.logger.error(err);
                }
            })
            .expectStatus(200)
            .exceptionHandler(function(e) {
                env.logger.error(e);
            })
            .expectJSON({
                status: Boolean,
                data: Array,
                text: String,
                request_id: String
            })
            .toss();

        if (unauthorized){
            frisby.create(path.get.summary)
                .get(env.api_url + key)
                .expectStatus(200)
                .exceptionHandler(function(e) {
                    env.logger.error(e);
                })
                .after(function (err, res, body) {
                    if (res.statusCode != 200){
                        console.log(body);
                    }
                    if (err){
                        env.logger.error(err);
                    }
                })
                .expectJSON({
                    status: Boolean,
                    data: Array,
                    text: String,
                    request_id: String
                })
                .toss();
        }
    }
});