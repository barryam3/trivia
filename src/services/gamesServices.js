const base_url = '/api/games';

export default {
  addGame: (uid, contestants, singlecsv, doublecsv, finaltxt) => {
    return fetch(base_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: uid,
        contestants: contestants,
        singlecsv: singlecsv,
        doublecsv: doublecsv,
        finaltxt: finaltxt
      })
    }).then(res => res.json());
  },

  getGame: uid => {
    return fetch(base_url + '/' + uid).then(res => res.json());
  },

  askQuestion: (uid, qid) => {
    return fetch(base_url + '/' + uid + '/questions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qid: qid
      })
    }).then(res => res.json());
  },

  updateScore: (uid, key, diff) => {
    return fetch(base_url + '/' + uid + '/scores', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: key,
        diff: diff
      })
    }).then(res => res.json());
  },

  updateScreen: (uid, screen) => {
    return fetch(base_url + '/' + uid + '/screen', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        screen: screen
      })
    }).then(res => res.json());
  },

  updateShown: (uid, shown) => {
    return fetch(base_url + '/' + uid + '/shown', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shown: shown
      })
    }).then(res => res.json());
  }
};
