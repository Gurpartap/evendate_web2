const RenderPDF = require('../../node/node_modules/chrome-headless-render-pdf');


module.exports = {
    process: function (data, cb) {

        console.log(process.env.ENV);

        let domain = process.env.ENV === 'prod' ? 'https://evendate.io/' : 'http://localhost/';

        RenderPDF.generateSinglePdf(domain + 'email_files/email-offer-template.php?event_id=' + data.event_id + '&uuid=' + data.uuid, '../email_files/Evendate-Bill-' + data.uuid + '.pdf')
            .then(() => {
                data.attachments = [{
                    filename: 'Evendate-Bill-' + data.uuid + '.pdf',
                    path: '../email_files/Evendate-Bill-' + data.uuid + '.pdf'
                }];
                cb(data);
            })
            .catch((err) => {
                console.log(err);
            });

    }
};