/**
 * Created by kardi on 15.04.2016.
 */

let sql = require('sql');


sql.setDialect('postgres');

module.exports = {
    tg_users: sql.define({
        name: 'tg_users',
        columns: [
            'id',
            'user_id',
            'first_name',
            'last_name',
            'username',
            'json_data',
            'created_at',
            'updated_at'
        ]
    }),
    tg_chats: sql.define({
        name: 'tg_chats',
        columns: [
            'id',
            'chat_id',
            'title',
            'type',
            'json_data',
            'created_at',
            'updated_at'
        ]
    }),
    tg_topics: sql.define({
        name: 'tg_topics',
        columns: [
            'id',
            'keyword',
            'parent_id',
            'children_json',
            'keywords_json',
            'created_at',
            'updated_at'
        ]
    }),
    tg_messages: sql.define({
        name: 'tg_messages',
        columns: [
            'id',
            'chat_id',
            'message_id',
            'user_id',
            'json_data',
            'created_at',
            'updated_at'
        ]
    }),
    tg_sub_topics: sql.define({
        name: 'tg_sub_topics',
        columns: [
            'id',
            'chat_id',
            'tg_topic_id',
            'status',
            'created_at',
            'updated_at'
        ]
    }),
};