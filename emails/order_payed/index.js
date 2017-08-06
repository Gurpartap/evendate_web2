const RenderPDF = require('../../node/node_modules/chrome-headless-render-pdf');


module.exports = {
    process: function (data, cb) {

        console.log(process.env.ENV);

        let ticket_pdf = [],
            attachments = [],
            domain = process.env.ENV === 'prod' ? 'https://evendate.io/' : 'http://localhost/';
        data.tickets.forEach((ticket) => {
            ticket_pdf.push({
                    url: domain + 'print_ticket.php?uuid=' + ticket.uuid,
                    pdf: '../email_files/' + ticket.uuid + '.pdf'
                }
            );
            attachments.push({filename: ticket.uuid + '.pdf', path: '../email_files/' + ticket.uuid + '.pdf'});
        });

        data.attachments = attachments;
        console.log(ticket_pdf);
        RenderPDF.generateMultiplePdf(ticket_pdf)
            .then(() => {
                cb(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
};