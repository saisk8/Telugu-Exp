/* eslint-disable no-console */
// init project
const express = require('express');
const assert = require('assert');
const { MongoClient } = require('mongodb');
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'telugu-test';

const fs = require('fs');

const app = express();
// Create a new MongoClient
const mongo = new MongoClient(url, { useUnifiedTopology: true });

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
  response.sendFile(`${__dirname}/views/experiment.html`);
});

app.get('/thanks', (request, response) => {
  response.send('Thank you!');
});

app.get('/login', (request, response) => {
  response.sendFile(`${__dirname}/views/login.html`);
});

app.post('/complete', (request, response) => {
  fs.writeFile(`${request.body.user}.json`, request.body, (err) => {
    if (err) {
      console.log(err);
    }
  });
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
      const newDoc = { user, data: Array(28).fill(0), set: Array(3).fill(-1) };
      db.collection('users').insertOne(newDoc, (err2, r) => {
        assert.equal(null, err2);
        assert.equal(1, r.insertedCount);
        client.close();
      });
      return response.json({ status: false });
    });
  });
});

// Route to GET progress of a user
app.post('/get-exp-data', (request, response) => {
  mongo.connect((err, client) => {
    assert.equal(null, err);
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    const { user } = request.body;

    db.collection('users').findOne({ user }, (err1, doc) => {
      assert.equal(null, err1);
      if (doc !== null) {
        client.close();
        return response.json(doc);
      }
      return response.json(null);
    });
  });
});

// Route to save progress of the user
app.post('/save', (request, response) => {
  mongo.connect((err, client) => {
    assert.equal(null, err);
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    const { user } = request.body;
    const { data } = request.body;

    db.collection('users').findOneAndUpdate({ user }, { $set: { data } }, (err1, doc) => {
      assert.equal(null, err1);
      if (doc !== null) {
        client.close();
        return response.json({ status: 'done' });
      }
      client.close();
      return response.json({ status: 'nope' });
    });
  });
});

// listen for requests :)
app.listen(3000, () => {
  console.log('listening on 3000');
});
