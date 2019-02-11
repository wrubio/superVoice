const express = require('express')
const routes = require('./app/routes');
const app = express()
var bodyParser = require('body-parser')

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//init db
require('./db');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Serve the API first
app.use('/', routes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
