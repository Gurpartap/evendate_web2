let rest = require('restler');
const url = 'https://evendate.ru/api/v1/';

class APICaller {

    static getEvents(filters) {
        console.log(filters);
        return new Promise((resolve, reject) => {
            let _url = url + 'events/';
            if (filters.hasOwnProperty('id')){
                _url = _url + filters.id;
            }
            rest.get(_url, {
                json: true,
                query: filters
            }).on('complete', res => {

                if (res instanceof Error) {
                    return reject(res);
                } else if (res.status == false) {
                    return reject(res);
                } else {
                    return resolve(res);
                }
            })
        });
    }

    static getOrganizations(filters) {
        return new Promise((resolve, reject) => {
            rest.get(url + 'organizations', {
                json: true,
                query: filters
            }).on('complete', res => {

                if (res instanceof Error) {
                    return reject(res);
                } else if (res.status == false) {
                    return reject(res);

                } else {
                    return resolve(res);
                }
            })
        });
    }
}

module.exports = APICaller;