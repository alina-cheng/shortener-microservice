require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded({ extended: false }));

let urls = [];

app.post("/api/shorturl", function (req, res) {
  let url = req.body.url
  try {
    let parsed = new URL(url);
    if (!/https?:/.test(parsed.protocol)) {
      return res.json({ error: "invalid url" });
    }
  } catch (e) {
    return res.json({ error: "invalid url" });
  }
  urls.push(url);
  return res.json({ original_url: url, short_url: urls.length-1 });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  let shortUrl = req.params.short_url;
  if (!urls[shortUrl]) {
    return res.json({ error: "url not found" });
  } else {
    return res.redirect(urls[shortUrl]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
