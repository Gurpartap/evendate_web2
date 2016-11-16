/**
 * Created by kardi on 22.04.2016.
 */

var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    _ = require('lodash'),
    env = require(path.join(__dirname, './env.js'));

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

//
// function randomIntFromInterval(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }


_.forEach(env.api_docs.paths, function (path, key) {
    if (path.hasOwnProperty('get')) {

        if (collections_operation_ids.authorized.indexOf(path.get.operationId) == -1 &&
            collections_operation_ids.unauthorized.indexOf(path.get.operationId) == -1) return true;

        var unauthorized = collections_operation_ids.unauthorized.indexOf(path.get.operationId) != -1;

        frisby.create(path.get.summary)
            .get(env.api_url + key, {
                request: {
                    headers: {'Authorization': env.token}
                }
            })
            .expectStatus(200)
            .expectJSON({
                status: Boolean,
                data: Array,
                text: String,
                request_id: String
            })
            .afterJSON(function (events) {

            })
            .toss();

        if (unauthorized){
            frisby.create(path.get.summary)
                .get(env.api_url + key)
                .expectStatus(200)
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