crypto = require('crypto');

class BitcoinCheker {



    init(client, rest) {
        this.client = client;
        this.rest = rest;
        this.client_secret = '4d0480efc15c10be631bceee3a36ebed8b101827df4f41009fc98b0672fa1153';
    }

    updateStatuses() {
        let q_get_orders = `SELECT  bitcoin_addresses.address, 
            bitcoin_addresses.waiting_amount,
            view_tickets_orders.uuid
            FROM view_tickets_orders
             INNER JOIN bitcoin_addresses ON bitcoin_addresses.ticket_order_id = view_tickets_orders.id 
            WHERE view_tickets_orders.status_id IN (1, 12)`,
            _client = this.client,
            _rest = this.rest,
            _secret = this.client_secret;
        _client.query(q_get_orders, (err, res) => {
            if (err) return;
            res.rows.forEach((appended_address) => {
                _rest.get('https://blockchain.info/ru/rawaddr/' + appended_address.address)
                    .on('complete', (response) => {
                        if (response instanceof Error) return;
                        console.log(response);
                        let params = [
                                appended_address.address,
                                appended_address.waiting_amount,
                                appended_address.uuid,
                                _secret
                            ];
                        //response is in satoshi
                        console.log(parseFloat(response.final_balance / 100000000));
                        console.log(parseFloat(appended_address.waiting_amount));
                        if (parseFloat(response.final_balance / 100000000) === parseFloat(appended_address.waiting_amount)){
                            console.log('FIND!');
                            _rest.post('http://localhost/api/v1/payments/bitcoin/aviso?bitcoin=true', {
                                data: {
                                    address: appended_address.address,
                                    waiting_amount: appended_address.waiting_amount,
                                    uuid: appended_address.uuid,
                                    key: crypto.createHash('md5').update(params.join('')).digest("hex")
                                }
                            })
                                .on('complete', (data, res) => {
                                    console.log(res.rawEncoded);
                                });
                        }
                    });
            });
        })
    }

}

module.exports = BitcoinCheker;