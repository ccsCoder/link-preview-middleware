const express = require('express');
const linkPreviewGenerator = require('link-preview-generator');
const cors = require('cors');

const app = express();
const port = 3000;

const puppeteerArgs = ['--no-sandbox'];

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// ping route
app.get('/', (req, res) => {
  res.json({message: 'Server is up at port:'+port })
});

app.get('/get-preview-info', cors(corsOptions) ,function(req, res) {
  console.log(req.body.url);
  linkPreviewGenerator(req.body.url, puppeteerArgs)
    .then(resp => {
      resp.img = resp.img === null ? './default.png': resp.img;
      res.json(resp);
    })
    .catch(error => {
      res.json({errorMessage: 'Something went wrong while fetching website details. Please check the URL.'});
      console.error(error);
    });
});

// more routes here.

app.listen(process.env.PORT, () => {
  console.log('Server started on port: '+ port);
});
