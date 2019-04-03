// Requires
var express = require('express');
var bodyParser = require('body-parser');

// init variables
var app = express();

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

// Listen requires
app.listen(3002, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '3002');
})