/* eslint-disable no-console */
// init project
const express = require('express');

// Start app
const app = express();
// Create a new MongoClient

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

// listen for requests :)
app.listen(3000, () => {
  console.log('Open at http://localhost:3000');
});
