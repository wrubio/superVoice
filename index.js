// Requires
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes');
const mongoose = require('mongoose');
var http = require('http');
var path = require('path');


const AWS = require('aws-sdk');
// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/app/services/config.json');

const redis = require("redis");
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const client = redis.createClient('redis://superuser.abboen.ng.0001.use1.cache.amazonaws.com:6379', { no_ready_check: true });

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function(err) {
    console.log('Something wrong ' + err);
});


// init variables
const app = express();

// Public dist
app.use(express.static(__dirname + '/dist'));
app.get('/*', (req, res) => res.sendfile(path.join(__dirname)));


// Middleware 
app.use(session({
    secret: 'redisSuperVoice2019$',
    store: new redisStore({ client: client, ttl: 260 }),
    saveUninitialized: false,
    resave: false
}));

// Enable Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS");
    next();
});

/**
 * BODYPARSER 
 * @parse application/x-www-form-urlencoded
 * @parse application/json
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Database connection
require('./app/config/db');

// routes
app.use('/', routes);

// Listen requires
app.listen(4005, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '4005');
})