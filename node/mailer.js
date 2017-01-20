let fs = require('fs');
let utils = require('./utils');
let async = require('async');

const EMAILS_PATH = '../emails/';

class Mailer {


    constructor(transporter) {
        this.transporter = transporter;
        this.html = fs.readFileSync(EMAILS_PATH + 'main_part.html', {encoding: 'utf8'});
    }

    constructLetter(name, data) {

        if (fs.existsSync(EMAILS_PATH + name + '/index.js')) {
            let dataHandler = require(EMAILS_PATH + name + '/index.js');
            data = dataHandler.process(data);
        }

        let header = fs.readFileSync(EMAILS_PATH + name + '/header.html', {encoding: 'utf8'});
        let body = fs.readFileSync(EMAILS_PATH + name + '/body.html', {encoding: 'utf8'});

        this.html = utils.replaceTags(this.html, {
            header_part: utils.replaceTags(header, data),
            body_part: utils.replaceTags(body, data)
        });

        this.html = utils.replaceTags(this.html, data);
        return this;
    }

    send(to, subject, callback) {
        console.log(to);
        console.log('Sending', subject);
        this.transporter.sendMail({
            debug: true,
            connectionTimeout: 50000,
            greetingTimeout: 50000,
            socketTimeout: 50000,
            from: '"Evendate" <feedback@evendate.ru>',
            to: 'kardinal3094@gmail.com',
            subject: subject,
            html: this.html
        }, callback);
    }

    sendScheduled(client, handleError) {
        let self = this,
            queue = [],
            q_get_emails = 'SELECT emails.*, ' +
                'email_types.type_code, ' +
                'email_types.name as subject ' +
                ' FROM emails ' +
                ' INNER JOIN email_types ON email_types.id = emails.email_type_id' +
                ' WHERE is_sending = FALSE ' +
                ' AND is_sended = FALSE' +
                ' AND attempts < 5' +
                ' ORDER BY created_at' +
                ' LIMIT 4',
            q_upd_is_sending = 'UPDATE emails SET is_sending = TRUE WHERE id = $1',
            q_ins_email_sent_attempt = 'INSERT INTO emails_sent(email_id, error, info) VALUES($1, $2, $3)',
            q_upd_is_not_sending = 'UPDATE emails SET is_sending = FALSE, attempts = $2, is_sended = $3 WHERE id = $1';
        client.query(q_get_emails, [], function (err, res_emails) {
            if (err) return handleError(err);

            res_emails.rows.forEach(email => {
                (mail => {
                    queue.push(function (callback) {
                        client.query(q_upd_is_sending, [mail.id], function (upd_err) {
                            if (upd_err) {
                                handleError(upd_err);
                                callback(null);
                            }

                            mail.data.subject = utils.replaceTags(mail.subject, mail.data);
                            self.constructLetter(mail.type_code, mail.data);
                            self.send(mail, utils.replaceTags(mail.subject, mail.data), function (err, res) {

                                let is_sended = err == null;
                                client.query(q_ins_email_sent_attempt, [mail.id, err == null ? null : JSON.stringify(err), JSON.stringify(res)], function (ins_err) {
                                    if (ins_err) {
                                        handleError(ins_err);
                                    }
                                    callback(null);
                                });

                                client.query(q_upd_is_not_sending, [mail.id, parseInt(mail.attempts) + 1, is_sended], function (upd2_err) {
                                    if (upd2_err) return handleError(upd2_err);
                                });
                            });
                        });
                    });

                })(email);
            });

            async.series(queue);
        });
    }
}

module.exports = Mailer;