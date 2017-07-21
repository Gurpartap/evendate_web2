let fs = require('fs');
let utils = require('./utils');
let async = require('async');
let path = require('path');

const EMAILS_PATH = '../emails/';

class Mailer {


    constructor(transporter, logger) {
        this.transporter = transporter;
        this.logger = logger;
        this.html = fs.readFileSync(EMAILS_PATH + 'main_part.html', {encoding: 'utf8'});
    }

    constructLetter(name, data, cb) {

        let process_tags = true,
        dataHandler = {
            process: function(data, callback){
                callback(data);
            }
        };

        if (fs.existsSync(EMAILS_PATH + name + '/index.js')) {
            dataHandler = require(EMAILS_PATH + name + '/index.js');
        }else{
            console.log('file not found;' + EMAILS_PATH + name + '/index.js' );

        }

        dataHandler.process(data, (handled_data) => {
            if (dataHandler.replace_main != undefined) {
                this.html = fs.readFileSync(path.resolve(EMAILS_PATH, name, dataHandler.replace_main), {encoding: 'utf8'});
            }
            if (dataHandler.process_tags != undefined) {
                process_tags = dataHandler.process_tags;
            }

            if (process_tags) {
                let header = fs.readFileSync(EMAILS_PATH + name + '/header.html', {encoding: 'utf8'});
                let body = fs.readFileSync(EMAILS_PATH + name + '/body.html', {encoding: 'utf8'});


                const _data = Object.assign({}, handled_data, {
                    header_part: utils.replaceTags(header, handled_data),
                    body_part: utils.replaceTags(body, handled_data)
                });

                this.html = utils.replaceTags(this.html, _data);
                this.html = utils.replaceTags(this.html, handled_data);
            }

            fs.writeFileSync(EMAILS_PATH + name + '/test.html', this.html);
            cb(handled_data);
        });

    }

    send(to, subject, attachments, callback) {
        console.log('attachments', attachments);
        this.transporter.sendMail({
            debug: true,
            connectionTimeout: 50000,
            greetingTimeout: 50000,
            socketTimeout: 50000,
            from: '"Evendate" <feedback@evendate.ru>',
            to: to,
            attachments: attachments,
            subject: subject,
            html: this.html
        }, callback);
    }

    sendScheduled(client, handleError) {
        let self = this,
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
                let _mailer = new Mailer(self.transporter, self.logger);
                client.query(q_upd_is_sending, [email.id], function (upd_err) {
                    if (upd_err) {
                        handleError(upd_err);
                    }

                    email.data.email = email.recipient;
                    email.data.email_id = email.id;
                    email.data.email_type_code = email.type_code;
                    email.data.subject = utils.replaceTags(email.subject, email.data);
                    _mailer.constructLetter(email.type_code, email.data, (data) => {
                        console.log('data: ', data);
                        _mailer.send(email.recipient, email.data.subject, data.attachments, function (err, res) {

                            let is_sended = err == null;
                            client.query(q_ins_email_sent_attempt, [email.id, err == null ? null : JSON.stringify(err), JSON.stringify(res)], function (ins_err) {
                                if (ins_err) {
                                    handleError(ins_err);
                                }
                            });

                            client.query(q_upd_is_not_sending, [email.id, parseInt(email.attempts) + 1, is_sended], function (upd2_err) {
                                if (upd2_err) return handleError(upd2_err);
                            });
                        });
                    });
                });
            });
        });
    }
}

module.exports = Mailer;