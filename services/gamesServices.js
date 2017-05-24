const base_url = (process.env.NODE_ENV ? '' :
    'http://localhost:3000') + '/games';

var request = require('request-promise-native');

export default {

    addGroup: (uid, contestants, singlecsv, doublecsv, finaltxt) => {
        return request({
            uri: base_url,
            method: 'POST',
            json: true,
            body: {
                uid: uid,
                contestants: contestants,
                singlecsv: singlecsv,
                doublecsv: doublecsv,
                finaltxt: finaltxt
            }
        });
    }
}