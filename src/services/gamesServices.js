const baseURL = '/api/games';

export default {
  addGame: (uid, contestants, singlecsv, doublecsv, finaltxt) =>
    fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid,
        contestants,
        singlecsv,
        doublecsv,
        finaltxt
      })
    }).then(res => res.json()),

  getGame: uid => fetch(`${baseURL}/${uid}`).then(res => res.json()),

  askQuestion: (uid, qid) =>
    fetch(`${baseURL}/${uid}/questions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qid
      })
    }).then(res => res.json()),

  updateScore: (uid, key, diff) =>
    fetch(`${baseURL}/${uid}/scores`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key,
        diff
      })
    }).then(res => res.json()),

  updateScreen: (uid, screen) =>
    fetch(`${baseURL}/${uid}/screen`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        screen
      })
    }).then(res => res.json()),

  updateShown: (uid, shown) =>
    fetch(`${baseURL}/${uid}/shown`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shown
      })
    }).then(res => res.json())
};
