"use strict";

const
    geolite2 = require('geolite2'),
    maxmind = require('maxmind'),
    express = require("express"),
    app = express();

maxmind.open(geolite2.paths.city, (err, cityLookup) => {
    app.get('/utils/geoip/', function (req, res) {
        let city = cityLookup.get(req.query.ip);
        if (city.getHasOwnProperty('location') && city.getHasOwnProperty('latitude')) {
            res.json(city.location);
        } else {
            res.json({latitude: 55.75, longitude: 37.61})
        }
    });

    app.listen(16101, function () {
        console.log('Node listening on port 16101!');
    });
});