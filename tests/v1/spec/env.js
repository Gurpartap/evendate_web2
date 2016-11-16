var
    fs = require('fs'),
    path = require('path'),
    config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../v1-config.json'))),
    api_docs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../api/v1/docs/swagger.json')));


var config_index = process.env.ENV ? process.env.ENV : 'local',
    real_config = config[config_index];

real_config.api_url = real_config.schema + real_config.test.domain + '/api/v1/';
real_config.api_docs = api_docs;
real_config.token = 'EAAYDHIPuIBYBAGBXQvnBZB7ia4wAH1DSYS7OZCZC3KZC7RWAItxKSeqB1MQa9xdqj11kZC2xUZCE8qeAhDEHM3XpP0qfJKupWtdEsRK3PflE5p4PL24UDYXsdR3JAyQkeZAMAwUUQMuEZA5dyDr9Wozg4GeqQfGjoBzfK0FS5QjIcgZDZDundefinedROMESYLpZ9FFsKSIpMTEXqKCJ3pnKpD2';

module.exports = real_config;