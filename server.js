// init project
const express = require('express');
const fs = require('fs');

const app = express();

// http://expressjs.com/en/starter/static-files.html
app.use('/css', express.static('static/css'));
app.use('/js', express.static('static/js'));
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
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get('/thanks', (request, response) => {
  response.send('Thank you!');
});

app.post('/complete', (request, response) => {
  fs.writeFile('test.txt', request.body.value, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
  response.redirect('http://localhost:3000/thanks');
});

// listen for requests :)
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on 3000');
});
