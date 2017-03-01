var
    fs = require('fs'),
    path = require('path'),
    winston = require('winston'),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/tests.log', json: true})
        ],
        exceptionHandlers: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/tests_exceptions.log', json: true})
        ],
        exitOnError: true
    }),
    frisby = require('frisby'),
    config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../v1-config.json'))),
    api_docs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../api/v1/docs/swagger.json')));


var config_index = process.env.ENV ? process.env.ENV : 'local',
    real_config = config[config_index];



real_config.api_url = real_config.schema + real_config.test.domain + '/api/v1/';
real_config.api_docs = api_docs;
real_config.logger = logger;
real_config.token = 'ya29.CjaiA_rYHeHwY9qFlNHnmFs9w-2x1x-FWLnXzZA7Mht12IIvA9gsljsCzMXjt5AkBz-naz9PsrsundefinedR1QN4E6v8oSOA0xm2LmEQrxcqd7NYSis';
real_config.not_admin_token = 'df5820c2e6df18357eb439bf5b41ae8dca0dd4996465f3003212d2bda7f1cfcb86f94a86743ac6e491f4dundefinedZ6HyradZpDQaXfa5NW54S1sXHEWw8LsF';

if (config_index == 'local') {
    frisby.globalSetup({
        request: {
            headers: {'Authorization': real_config.token},
            timeout: (30*1000)
        }
    });
}


real_config.frisby = frisby;
module.exports = real_config;