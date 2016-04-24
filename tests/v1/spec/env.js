var
    fs = require('fs'),
    path = require('path'),
    config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../v1-config.json')));


var config_index = process.env.ENV ? process.env.ENV : 'local',
    real_config = config[config_index];

real_config.api_url = real_config.schema + real_config.test.domain + '/api/v1/';

exports.module = real_config;