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
const dbName = 'telugu-test';

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
  'ణ'
];
const teluguPairs = shuffleSeed.shuffle(
  telugu.flatMap((v, i) => telugu.slice(i + 1).map(w => [v, w])),
  'Telugu'
);
let set = 0;
const numberOfSets = teluguPairs.length / 23;
// Start app
const app = express();
// Create a new MongoClient
const mongo = new MongoClient(url, { useUnifiedTopology: true });

function getSetNumber() {
  const curr = set;
  set += 1;
  set %= numberOfSets;
  return curr;
}

function getSet(setNo) {
  const start = 23 * setNo;
  return teluguPairs.slice(start, start + 23);
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

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.redirect('http://localhost:3000/login');
});

app.get('/exp', (request, response) => {
  response.sendFile(`${__dirname}/Views/experiment.html`);
});

app.get('/thanks', (request, response) => {
  response.send('Thank you!');
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
  mongo.connect((err, client) => {
    assert.equal(null, err);
    console.log('Connected correctly to server');
    const db = client.db(dbName);
    const newDoc = { user, set: Array(numberOfSets).fill(0) };
    db.collection('users').insertOne(newDoc, (err2, r) => {
      assert.equal(null, err2);
      assert.equal(1, r.insertedCount);
      client.close();
    });
    return response.redirect('http://localhost:3000/login');
  });
});

app.post('/complete', (request, response) => {
  const { user } = request.body;
  let { data } = request.body;
  const fileName = request.body.setNumber;
  const path = `Results/${user}`;
  fs.ensureDirSync(path);
  data = JSON.stringify(data);
  fs.writeFileSync(`${path}/set-${fileName}.json`, data);
  response.redirect('http://localhost:3000/thanks');
});

// Route to create a new user
app.post('/login-val', (request, response) => {
  mongo.connect((err, client) => {
    assert.equal(null, err);
    console.log('Connected correctly to server');
    const db = client.db(dbName);
    const { user } = request.body;
    db.collection('users').findOne({ user }, (err1, doc) => {
      assert.equal(null, err1);
      if (doc !== null) {
        client.close();
        return response.json({ status: true });
      }
      client.close();
      return response.json({ status: false });
    });
  });
});

// Route to GET progress of a user
app.get('/get-exp-data', (request, response) => {
  mongo.connect((err, client) => {
    assert.equal(null, err);
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    const { user } = request.body;

    db.collection('users').findOne({ user }, (err1, doc) => {
      assert.equal(null, err1);
      if (doc !== null) {
        client.close();
        let setNumber = getSetNumber();
        if (doc.set[setNumber].indexOf(-1) !== -1) setNumber = doc.set[setNumber].indexOf(-1);
        else if (doc.set[setNumber] === 1) setNumber = doc.set.indexOf(0);
        const newDoc = {};
        newDoc.user = doc.user;
        newDoc.setNumber = setNumber;
        newDoc.set = getSet(setNumber);
        return response.json(newDoc);
      }
      return response.json(null);
    });
  });
});

// listen for requests :)
app.listen(3000, () => {
  console.log('listening on 3000');
});
