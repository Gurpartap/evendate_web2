
let fs = require('fs');
let path = require('path');
let Utils = require('../../node/utils');
let rest = require('../../node/restler');
let async = require('../../node/async');
let conversion = require('../../node/phantom-html-to-pdf');

module.exports = {
    process: function(data, cb){
        console.log('Running file;');

        let ticket_htmls = [];
        data.tickets.forEach((ticket) => {
            ticket_htmls.push((callback) => {
                conversion({ url: 'htpps://localhost/print_ticket.php?uuid=' + ticket.uuid }, function(err, pdf) {
                    console.log(pdf.logs);
                    console.log(pdf.numberOfPages);
                    pdf.stream.pipe(fs.createWriteStream('../../email_files/' + ticket.uuid + '.pdf'));
                });
            })
        });

        async.parallel(ticket_htmls);


        return cb(data);
    }
};