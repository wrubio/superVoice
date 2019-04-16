const express = require('express')
const routes = require('./app/routes');
const app = express()
var bodyParser = require('body-parser')
var http = require('http');
var path = require('path');

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS");
    next();
});

//init db
require('./db');

// Public dist
app.use(express.static(__dirname + '/dist'));
app.get('/*', (req, res) => res.sendfile(path.join(__dirname)));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Serve the API first
app.use('/', routes);

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})