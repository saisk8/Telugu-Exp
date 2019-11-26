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
const dbName = 'telugu-alpha';

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
  const curr = set;
  set += 1;
  if (set === numberOfSets) {
    cycle += 1;
    teluguPairs = shuffleSeed.shuffle(
      telugu.flatMap((v, i) => telugu.slice(i + 1).map(w => [v, w])),
      cycle
    );
  }
  set %= numberOfSets;
  return curr;
}

function getSet(setNo) {
  const start = numberOfSamples * setNo;
  return teluguPairs.slice(start, start + numberOfSamples);
}

// Use connect method to connect to the Server
// http://expressjs.com/en/starter/static-files.html
app.use('/css', express.static('static/css'));
app.use('/js', express.static('static/js'));
app.use('/images', express.static('static/images'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('charset', 'utf-8');
  next();
});

let db = null;
mongo.connect((err, client) => {
  assert.equal(null, err);
  console.log('Connected correctly to server');
  db = client.db(dbName);
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.redirect('/login');
});

app.get('/exp', (request, response) => {
  response.sendFile(`${__dirname}/Views/experiment.html`);
});

app.get('/instructions', (request, response) => {
  response.sendFile(`${__dirname}/Views/instructions.html`);
});

app.get('/thanks', (request, response) => {
  response.sendFile(`${__dirname}/Views/thankyou.html`);
});

app.get('/login', (request, response) => {
  response.sendFile(`${__dirname}/Views/login.html`);
});

app.get('/register', (request, response) => {
  response.sendFile(`${__dirname}/Views/register.html`);
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
  response.json({ status: true });
});

app.post('/complete', (request, response) => {
  const { user } = request.body.expData;
  const cycleNo = cycle;
  const fileName = request.body.setNumber.expData;
  const path = `Results/${user}`;
  fs.ensureDirSync(path);
  const data = JSON.stringify(request.body.expData);
  fs.writeFileSync(`${path}/${cycleNo}/set-${fileName}.json`, data);
  return response.json({ status: true });
});

// Route to create a new user
app.post('/login-val', (request, response) => {
  const { user } = request.body;
  db.collection('users').findOne({ user }, (err1, doc) => {
    assert.equal(null, err1);
    if (doc !== null) {
      return response.json({ status: true });
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
app.listen(3000, () => {
  console.log('Open at http://localhost:3000');
});
