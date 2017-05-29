const base_url = (process.env.NODE_ENV ? '' :
    'http://localhost:3000') + '/games';

var request = require('request-promise-native');

export default {

    addGame: (uid, contestants, singlecsv, doublecsv, finaltxt) => {
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
    },

    getGame: (uid) => {
        return request({
            uri: base_url + '/' + uid,
            method: 'GET',
            json: true
        });
    },

    askQuestion: (uid, qid) => {
        return request({
            uri: base_url + '/' + uid + '/questions',
            method: 'PUT',
            json: true,
            body: {
                qid: qid
            }
        });
    },

    updateScore: (uid, key, diff) => {
        return request({
            uri: base_url + '/' + uid + '/scores',
            method: 'PUT',
            json: true,
            body: {
                key: key,
                diff: diff
            }
        });
    },

    updateScreen: (uid, screen) => {
        return request({
            uri: base_url + '/' + uid + '/screen',
            method: 'PUT',
            json: true,
            body: {
                screen: screen
            }
        });
    },

    updateShown: (uid, shown) => {
        return request({
            uri: base_url + '/' + uid + '/shown',
            method: 'PUT',
            json: true,
            body: {
                shown: shown
            }
        });
    }

}