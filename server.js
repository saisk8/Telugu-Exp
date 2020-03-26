/* eslint-disable no-console */
// init project
const express = require('express');
const cors = require('cors');

// Start app
const app = express();

// http://expressjs.com/en/starter/static-files.html
app.use('/css', express.static('static/css'));
app.use('/js', express.static('static/js'));
app.use('/images', express.static('static/images'));
app.use('/fonts', express.static('static/fonts'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());

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

app.get('/done', (request, response) => {
  response.sendFile(`${__dirname}/Views/done.html`);
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
