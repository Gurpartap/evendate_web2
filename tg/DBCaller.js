const
    fs = require('fs'),
    pg = require('pg'),
    config = JSON.parse(fs.readFileSync('../v1-config.json')),
    config_index = process.env.ENV ? process.env.ENV : 'local',
    Entities = require('./entities'),
    real_config = config[config_index],
    pg_conn_string = [
        'postgres://',
        real_config.db.user,
        ':', real_config.db.password,
        '@', real_config.db.host,
        ':', real_config.db.port,
        '/', real_config.db.database
    ].join(''),
    q_get_topics = fs.readFileSync('./get_event_topics.sql', {encoding: 'utf8'});

class DBCaller {

    constructor() {
        let _this = this;
        console.log(pg_conn_string);
        pg.connect(pg_conn_string, function (err, client, done) {
            if (err) {
                console.log(err);
            }
            _this._client = client;
        });
    }

    saveChat(chat) {
        let client = this._client;
        client.query('INSERT INTO tg_chats(chat_id, title, type, json_data) ' +
            ' VALUES ($1, $2, $3, $4) ON CONFLICT(chat_id) DO UPDATE SET ' +
            ' title = $2, type = $3, json_data = $4, updated_at = NOW()', [chat.id, chat.title, chat.type, JSON.stringify(chat)], (err, res) => {
            if (err) console.log(err);
        });
    }

    saveUser(user) {
        let client = this._client;
        client.query('INSERT INTO tg_users(user_id, first_name, last_name, username, json_data) ' +
            ' VALUES ($1, $2, $3, $4, $5) ON CONFLICT(user_id) DO UPDATE SET ' +
            ' first_name = $2, last_name = $3, username = $4, json_data = $5, updated_at = NOW()', [user.id, user.first_name, user.last_name, user.username, JSON.stringify(user)], (err, res) => {
            if (err) console.log(err);
        });
    }

    saveMessage(message) {
        let client = this._client;
        client.query('INSERT INTO tg_messages(chat_id, message_id, user_id, json_data) ' +
            ' VALUES ($1, $2, $3, $4) ', [message.chat.id, message.message_id, message.from.id, JSON.stringify(message)], (err, res) => {
            if (err) console.log(err);
        });
    }

    getTopics() {
        let client = this._client;
        return new Promise((resolve, reject) => {
            client.query('SELECT * FROM tg_topics WHERE parent_id IS NULL', [], (err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res.rows);
                }
            })
        });
    }

    getSubTopics(chat_id) {
        let client = this._client;
        return new Promise((resolve, reject) => {
            client.query('SELECT tg_topics.* FROM ' +
                '   tg_topics ' +
                ' INNER JOIN tg_sub_topics ON tg_sub_topics.tg_topic_id = tg_topics.id' +
                ' WHERE parent_id IS NULL AND tg_sub_topics.status = TRUE AND chat_id = $1', [chat_id], (err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res.rows);
                }
            })
        });
    }

    setSubscriptionStatus(chat_id, keyword, status) {
        let client = this._client;
        return new Promise((resolve, reject) => {
            client.query('INSERT INTO tg_sub_topics(chat_id, tg_topic_id, status) ' +
                ' SELECT $1 AS chat_id, id AS tg_topic_id, $2 AS status ' +
                ' FROM tg_topics ' +
                ' WHERE keyword = $3' +
                ' ON CONFLICT (chat_id, tg_topic_id) DO UPDATE SET status = $2' +
                ' RETURNING id', [chat_id, status, keyword], (err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res.rows[0].id);
                }
            })
        });
    }

    getIsSubscribed(chat_id, topic_name) {
        let client = this._client;
        return new Promise((resolve, reject) => {
            client.query('SELECT tg_sub_topics.status FROM ' +
                '   tg_sub_topics ' +
                ' INNER JOIN tg_topics ON tg_sub_topics.tg_topic_id = tg_topics.id' +
                ' WHERE parent_id IS NULL AND tg_topics.keyword = $1 AND chat_id = $2', [topic_name, chat_id], (err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    let result = false;
                    if (res.rows.length == 1 && res.rows[0].status == true) {
                        result = true
                    }
                    return resolve(result);
                }
            })
        });
    }

    getTopicTags(topic_name) {
        let client = this._client;
        return new Promise((resolve, reject) => {
            client.query('SELECT' +
                ' tg_topics.id,' +
                '     tg_topics.keyword,' +
                '     FALSE AS is_tags' +
                ' FROM tg_topics' +
                ' WHERE parent_id = (SELECT id' +
                ' FROM tg_topics' +
                ' WHERE keyword = $1 AND parent_id IS NULL)' +
                ' AND children_json IS NOT NULL' +
                ' UNION ALL' +
                ' (SELECT' +
                ' NULL AS                               id,' +
                '     string_agg(tg_topics.keyword, \', \') AS keyword,' +
                '     TRUE AS                               is_tags' +
                ' FROM tg_topics' +
                ' WHERE parent_id = (SELECT id' +
                ' FROM tg_topics' +
                ' WHERE keyword = $1 AND parent_id IS NULL)' +
                ' AND children_json IS NULL' +
                ' GROUP BY parent_id)', [topic_name], (err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res.rows);
                }
            })
        });
    }

    getToNotify(event_id) {
        let client = this._client;
        return new Promise((resolve, reject) => {
            client.query(q_get_topics, [event_id], (err, topics) => {
                if (err) {
                    return reject(err);
                } else {
                    let topic_ids = [];
                    console.log(topics);
                    topics.rows.forEach((topic) => {
                        if (topic.lvl1_tags > 0 || topic.lvl2_tags > 0){
                            topic_ids.push(topic.id);
                        }else if (topic.euristic > 0.04){
                            topic_ids.push(topic.id);
                        }
                    });
                    let q_get_chat_ids = Entities.tg_sub_topics.select(
                        Entities.tg_sub_topics.star()
                    ).where(Entities.tg_sub_topics.tg_topic_id.in(topic_ids))
                        .where(Entities.tg_sub_topics.status.equals(true)).toQuery();
                    console.log(q_get_chat_ids.text);
                    console.log(q_get_chat_ids.values);
                    client.query(q_get_chat_ids, (err, chats) => {
                        if (err) {
                            return reject(err);
                        }else{
                            return resolve(chats.rows);
                        }
                    });

                }
            });
        });
    }
}

module.exports = DBCaller;