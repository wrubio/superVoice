const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const work = require('./app/works/ffmpeg');

AWS.config.loadFromPath(__dirname + '/config/config.json');

const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/662846764246/superVoice',
    batchSize: 5,
    handleMessage: async(message) => {
        voice = JSON.parse(message.Body);
        const resVoiceConverter = await work.ffmpegVoice(voice).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

app.on('timeout_error', (err) => {
    console.error(err.message);
});

// Database connection
require('./config/db');

app.start();

/*
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
 *
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen requires
app.listen(3002, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '3002');
})
*/