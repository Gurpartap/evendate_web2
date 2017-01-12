
let fs = require('fs');
let utils = require('./utils');
const EMAILS_PATH = '../emails/';

class Mailer {


    constructor(transporter) {
        this.transporter = transporter;
        this.html = fs.readFileSync(EMAILS_PATH + 'main_part.html', {encoding: 'utf8'});
    }

    constructLetter(name, data) {
        this.html = utils.replaceTags(this.html, {
            header_part: fs.readFileSync(EMAILS_PATH + name + '/header.html', {encoding: 'utf8'}),
            body_part: fs.readFileSync(EMAILS_PATH + name + '/body.html', {encoding: 'utf8'})
        });

        this.html = utils.replaceTags(this.html, data);
        return this;
    }


    send(to, subject, callback) {
        this.transporter.sendMail({
            debug: true,
            connectionTimeout: 50000,
            greetingTimeout: 50000,
            socketTimeout: 50000,
            from: '"Evendate" <feedback@evendate.ru>',
            to: to,
            subject: subject,
            html: this.html
        }, callback);

    }
}

module.exports = Mailer;