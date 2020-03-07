/* eslint-disable no-console */
// init project
const express = require('express');
const assert = require('assert');
const shuffleSeed = require('shuffle-seed');
const fs = require('fs-extra');
const cors = require('cors');
// Type 3: Persistent datastore with automatic loading
const Datastore = require('nedb');

const db = new Datastore({ filename: 'DataStore', autoload: true });

// Data
const telugu = [
  'అ',
  'న',
  'వ',
  'మ',
  'య',
  'ల',
  'ర',
  'ఒ',
  'జ',
  'ఠ',
  'ఆ',
  'ఉ',
  'ఊ',
  'ఎ',
  'ఏ',
  'ప',
  'ఫ',
  'ద',
  'డ',
  'బ',
  'త',
  'క',
  'హ',
  'ణ',
  'ఘ'
];
const teluguPairs = telugu.flatMap((v, i) => telugu.slice(i + 1).map(w => [v, w]));
const numberOfSamplesPerExp = 30;
const totalSets = teluguPairs.length / numberOfSamplesPerExp;
// Start app
const app = express();

function getSet(setNo, user) {
  const start = numberOfSamplesPerExp * (setNo - 1);
  return shuffleSeed.shuffle(teluguPairs, user).slice(start, start + numberOfSamplesPerExp);
}

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());

// Route to create a new user
app.post('/add-user', (request, response) => {
  const { user } = request.body;
  const path = `Results/${user}`;
  fs.ensureDirSync(path);
  const data = JSON.stringify(request.body);
  fs.writeFileSync(`${path}/${user}-info.json`, data);
  const newDoc = { user, numberOfCompletedSets: 0 };
  db.insert(newDoc, err2 => {
    assert.equal(null, err2);
  });
  return response.json({ status: true });
});

// Route to address completion
app.post('/complete', (request, response) => {
  const { user } = request.body.expData;
  const fileName = request.body.expData.setNumber;
  const path = `Results/${user}`;
  fs.ensureDirSync(path);
  const data = JSON.stringify(request.body.expData);
  fs.writeFileSync(`${path}/set-${fileName}.json`, data);
  db.update({ user }, { $inc: { numberOfCompletedSets: 1 } }, {}, err1 => {
    assert.equal(err1, null);
  });
  return response.json({ status: true });
});

// Route to check for a valid login
app.post('/login-val', (request, response) => {
  const { user } = request.body;
  if (!user) return response.json({ status: false });
  db.findOne({ user }, (err1, doc) => {
    assert.equal(null, err1);
    if (doc !== null) {
      return response.json({ status: true });
    }
    return response.json({ status: false });
  });
});

// Route to GET new set of a user
app.get('/get-exp-data/:user', (request, response) => {
  const { user } = request.params;
  db.findOne({ user }, (err1, doc) => {
    const nextSet = doc.numberOfCompletedSets + 1;
    assert.equal(null, err1);
    if (nextSet > totalSets) return response.send('Done');
    const expData = {
      setNumber: nextSet,
      set: getSet(nextSet, doc.user)
    };
    return response.json(expData);
  });
});

// listen for requests :)
app.listen(3001, () => {
  console.log('Open at http://localhost:3001');
});
