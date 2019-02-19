// Requires
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

// init variables
var app = express();

// init cron
require('./cron');

// Public dist
app.use(express.static(__dirname + '/dist'));
app.get('/*', (req, res) => res.sendfile(path.join(__dirname)));
// app.use(express.static(__dirname + '/dist'));

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

// import routes
var appRoutes = require('./routes/app');
var appVoice = require('./routes/voice');
var appInvitation = require('./routes/invitation');
var appImageUpload = require('./routes/image-upload');

// routes
app.use('/voice', appVoice);
app.use('/imageUpload', appImageUpload);
app.use('/invitation', appInvitation);
app.use('/', appRoutes);

// Listen requires
app.listen(4000, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '4000');
})