const Entities = require('./entities');

class Broadcast {


    constructor(id, client, logger) {
        this.client = client;
        this.logger = logger;
        this.id = id;
        let q_get_broadcast = Entities.view_broadcasts.select(
            Entities.view_broadcasts.id,
            Entities.view_broadcasts.uuid,
            Entities.view_broadcasts.event_id,
            Entities.view_broadcasts.organization_id,
            Entities.view_broadcasts.owner_organization_id,
            Entities.view_broadcasts.is_email,
            Entities.view_broadcasts.is_push,
            Entities.view_broadcasts.is_sms,
            Entities.view_broadcasts.title,
            Entities.view_broadcasts.message_text,
            Entities.view_broadcasts.url,
            Entities.view_broadcasts.notification_time,
            Entities.view_broadcasts.is_active,
            Entities.view_broadcasts.done,
            Entities.view_broadcasts.created_at,
            Entities.view_broadcasts.updated_at,
            Entities.view_broadcasts.subject
        ).where(Entities.view_broadcasts.id.equals(id))
            .toQuery();
        return new Promise((resolve, reject) => {
            client.query(q_get_broadcast, (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows.length === 1) {
                    for (let key of rows[0]) {
                        this[key] = rows[0][key];
                    }
                    resolve(rows[0]);
                } else {
                    reject(new Error('CANT_FIND_BROADCAST'));
                }
            })
        });
    }

    setDone() {
        let q_upd_broadcast = Entities.view_broadcasts.update({
            done: true
        }).where(Entities.view_broadcasts.id.equals(this.id))
            .toQuery();
        return new Promise(function (resolve, reject) {
            this.client.query(q_upd_broadcast, (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows.length === 1) {
                    this.done = true;
                    resolve(true);
                } else {
                    reject(new Error('CANT_UPD_BROADCAST'));
                }
            })
        });
    }

    getEmailRecipients() {
        if (this.event_id) {
            let q_get_recipients = 'SELECT * FROM '
        } else {

        }
    }

    schedule() {
        return new Promise((resolve, reject) => {
            if (this.done) {
                resolve(true);
                return;
            }
            if (this.is_email) {

            } else if (this.is_push) {

            } else {
                reject(new Error('BAD_BROADCAST_TYPE'));
            }
        });
    }


}

module.exports = Broadcast;