// Requires
var express = require('express');
var mongoose = require('mongoose');

// init variables
var app = express();

// init cron
require('./cron/main');

// Listen requires
app.listen(3001, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '3000');
})