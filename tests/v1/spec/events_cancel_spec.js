/**
 * Created by kardi on 22.04.2016.
 */

var
    frisby = require('frisby'),
    fs = require("fs"),
    path = require('path'),
    env = require(path.join(__dirname, './env.js')).module;

frisby.globalSetup({
    request: {
        headers: { 'Authorization': env.test.token }
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
    .afterJSON(function(events) {
        // Now you can use 'json' in additional requests
        console.log(events);

        events.data.forEach(function(event){
            frisby.create('Set random status for event ' + event.id)
                .put(env.api_url + 'events/' + event.id + '/status?canceled=' + Math.round(Math.random()))
                .expectJSON({
                    status: Boolean,
                    data: Array,
                    text: String,
                    request_id: String
                })
                .after(function(err, res, body){
                    console.log(body);
                })
                .afterJSON(function(res) {
                    console.log(res);
                })
                .toss()
        });
    })
    .toss();