require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

var counter = 0
const shortUrls = {}

app.get('/api/shorturl/:index', function (req, res) {
  index = Number(req.params.index)
  url = Object.keys(shortUrls).find(key => shortUrls[key] === index)
  
  res.redirect(url)
})

app.post('/api/shorturl', function (req, res) {

  console.log(req.body.url)

  dns.lookup(new URL(req.body.url).hostname, function (err, address, family) {
    if (!err) {
      if (!shortUrls[req.body.url]) {
        shortUrls[req.body.url] = ++counter
      }

      res.json({
        original_url: req.body.url,
        short_url: shortUrls[req.body.url]
      })
    }
    else {
      res.json({
        error: 'invalid url'
      })
    }
  })
});

app.use(function (err, req, res, next) {
  res.json({
    error: 'invalid url'
  })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
