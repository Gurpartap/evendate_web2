/**
 * Created by kardi on 22.04.2016.
 */

var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    env = require(path.join(__dirname, '../env.js'));

frisby.globalSetup({
    request: {
        headers: {'Authorization': env.token}
    }
});

frisby.create('Get random events')
    .get(env.api_url + 'events/my?fields=random&order_by=random&length=20')
    .expectStatus(200)
    .expectJSONLength('data', 20)
    .expectJSON({
        status: Boolean,
        data: Array,
        text: String,
        request_id: String
    })
    .after(function (err, res, body) {
        if (err){
            env.logger.error(err);
        }
    })
    .exceptionHandler(function (e) {
        env.logger.error(e);
    })
    .afterJSON(function (events) {
        // Now you can use 'json' in additional requests

        events.data.forEach(function (event) {
            frisby.create('Set random status for event ' + event.id)
                .put(env.api_url + 'events/' + event.id + '/status?canceled=' + Math.round(Math.random()))
                .expectJSON({
                    status: Boolean,
                    data: Array,
                    text: String,
                    request_id: String
                })
                .after(function (err, res, body) {
                    if (err){
                        env.logger.error(err);
                    }
                })
                .exceptionHandler(function (e) {
                    env.logger.error(e);
                })
                .toss()
        });
    })
    .toss();