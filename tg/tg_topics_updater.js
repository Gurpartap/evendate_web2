const
    fs = require('fs'),
    monkey = require('./monkey.json'),
    async = require('async'),
    config = JSON.parse(fs.readFileSync('../v1-config.json')),
    pg = require('pg'),
    Entities = require('./entities');

let config_index = process.env.ENV ? process.env.ENV : 'local',
    real_config = config[config_index],
    pg_conn_string = [
        'postgres://',
        real_config.db.user,
        ':', real_config.db.password,
        '@', real_config.db.host,
        ':', real_config.db.port,
        '/', real_config.db.database
    ].join('');

pg.connect(pg_conn_string, function (err, client, done) {
    for (let key in monkey.data) {
        if (monkey.data.hasOwnProperty(key)) { //Образование, Развлечения, Культура и искусство

            console.log('1LVL: ', key);
            // insert first level
            let q_ins_first_level = 'INSERT INTO tg_topics(keyword, parent_id, children_json, keywords_json)' +
                ' VALUES ($1, $2, $3, $4) RETURNING id',
                keywords_json = [key];

            for(let __key in monkey.data[key]){
                if (monkey.data[key].hasOwnProperty(__key)){
                    if (__key != 'tags'){
                        keywords_json.push(__key);
                    }
                    keywords_json = keywords_json.concat(monkey.data[key][__key]);
                }
            }

            client.query(q_ins_first_level, [key, null, JSON.stringify(monkey.data[key]), JSON.stringify(keywords_json)], (err, res_0) => {
                if (err) {
                    console.log(err);
                    return;
                }
                let level_0_id = res_0.rows[0].id,
                    data_2 = monkey.data[key];
                for (let key2 in data_2) {  //Наука, Университеты, Карьера
                    if (data_2.hasOwnProperty(key2)){
                        console.log('2LVL: ', key2);
                        if (key2 == 'tags') {
                            data_2.tags.forEach(tag_name => {

                                console.log('TAG: ' + tag_name);
                                client.query(q_ins_first_level, [tag_name, level_0_id, null, JSON.stringify([tag_name])], (err_1) => {
                                    if (err_1) {
                                        console.log(err_1);
                                        return;
                                    }
                                });
                            });
                        } else {
                            client.query(q_ins_first_level, [key2, level_0_id, JSON.stringify(data_2[key2]), JSON.stringify([key2].concat(data_2[key2]))], (err_1, res_1) => {
                                if (err_1) {
                                    console.log(err_1);
                                    return;
                                }
                                let level_1_id = res_1.rows[0].id,
                                    data_3 = data_2[key2];
                                data_3.forEach(tag_name => {
                                    console.log('3LVL: ' + tag_name);

                                    client.query(q_ins_first_level, [tag_name, level_1_id, null, JSON.stringify([tag_name])], (err_2) => {
                                        if (err_2) {
                                            console.log(err_2);
                                            return;
                                        }
                                    });
                                });
                            });

                        }
                    }
                }
            });
        }
    }
});
