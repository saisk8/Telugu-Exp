// init project
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use('/css', express.static('static/css'));
app.use('/js', express.static('static/js'));


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});


// listen for requests :)
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening on 3000');
});
