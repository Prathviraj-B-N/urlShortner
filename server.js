require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
urls = {};
let shortUrl = 0;
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',(req,res)=>{
  let url = req.body.url;
  try{
  let domain = new URL(url);
  
  let hostname = domain.hostname;
  dns.lookup(hostname,error=>{
    if(error && error.code == 'ENOTFOUND'){
      res.json({ error: 'invalid url' });
    }else{
      urls[shortUrl] = url;
      shortUrl += 1;
      console.log(urls)
      res.json({ original_url : url, short_url : shortUrl})
    }
  });
  }catch(err){
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:surl',(req,res)=>{
  let url = req.params.surl;
  res.redirect(urls[url]);

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
