const RenderPDF = require('../../node/node_modules/chrome-headless-render-pdf');


module.exports = {
    process: function (data, cb) {

        let ticket_pdf = [],
            attachments = [];
        data.tickets.forEach((ticket) => {
            ticket_pdf.push({
                    url: 'http://localhost/print_ticket.php?uuid=' + ticket.uuid,
                    pdf: '../email_files/' + ticket.uuid + '.pdf'
                }
            );
            attachments.push({filename: ticket.uuid + '.pdf', path: '../email_files/' + ticket.uuid + '.pdf'});
        });

        RenderPDF.generateMultiplePdf(ticket_pdf)
            .catch((err) => {
                console.log(err);
            });
        cb({attachments: attachments});
    }
};