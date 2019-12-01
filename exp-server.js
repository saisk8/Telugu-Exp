/* eslint-disable no-console */
// init project
const express = require('express');
const assert = require('assert');
const shuffleSeed = require('shuffle-seed');
const { MongoClient } = require('mongodb');
const fs = require('fs-extra');

// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'telugu-alpha-1';

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
let cycle = 0;
let teluguPairs = shuffleSeed.shuffle(
  telugu.flatMap((v, i) => telugu.slice(i + 1).map(w => [v, w])),
  cycle
);
const numberOfSamples = 30;
let set = 0;
const numberOfSets = teluguPairs.length / numberOfSamples;
// Start app
const app = express();
// Create a new MongoClient
const mongo = new MongoClient(url, { useUnifiedTopology: true });

function getSetNumber() {
  // const curr = set;
  set += 1;
  if (set === numberOfSets) {
    cycle += 1;
    teluguPairs = shuffleSeed.shuffle(
      telugu.flatMap((v, i) => telugu.slice(i + 1).map(w => [v, w])),
      cycle
    );
  }
  set %= numberOfSets;
  return set;
}

function getSet(setNo) {
  const start = numberOfSamples * setNo;
  return teluguPairs.slice(start, start + numberOfSamples);
}

let db = null;
mongo.connect((err, client) => {
  assert.equal(null, err);
  console.log('Connected correctly to server');
  db = client.db(dbName);
});

app.post('/add-user', (request, response) => {
  const { user } = request.body;
  const path = `Results/${user}`;
  fs.ensureDirSync(path);
  const data = JSON.stringify(request.body);
  fs.writeFileSync(`${path}/${user}-info.json`, data);
  const newDoc = { user };
  db.collection('users').insertOne(newDoc, (err2, r) => {
    assert.equal(null, err2);
    assert.equal(1, r.insertedCount);
  });
  return response.redirect(`http://${request.headers.host}/login`);
});

app.post('/complete', (request, response) => {
  const { user } = request.body.expData;
  const cycleNo = cycle;
  const fileName = request.body.expData.setNumber;
  const path = `Results/${user}/${cycleNo}`;
  fs.ensureDirSync(path);
  const data = JSON.stringify(request.body.expData);
  fs.writeFileSync(`${path}/set-${fileName}.json`, data);
  return response.redirect(`http://${request.headers.host}/thanks`);
});

// Route to create a new user
app.post('/login-val', (request, response) => {
  const { user } = request.body;
  db.collection('users').findOne({ user }, (err1, doc) => {
    assert.equal(null, err1);
    if (doc !== null) {
      return response.redirect(`http://${request.headers.host}/exp`);
    }
    return response.json({ status: false });
  });
});

// Route to GET progress of a user
app.get('/get-exp-data', (request, response) => {
  const setNumber = getSetNumber();
  const expData = {
    setNumber,
    set: getSet(setNumber)
  };
  return response.json(expData);
});

// listen for requests :)
app.listen(3001, () => {
  console.log('Open at http://localhost:3001');
});
