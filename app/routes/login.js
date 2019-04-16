const express = require('express');
const router = require('express').Router();
const loginController = require('../controllers/loginController');

const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/config.json');

const log4js = require('log4js');
var fs = require('fs');

//Log de pruebas
log4js.configure({
    appenders: { cheese: { type: 'file', filename: './sessions.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger('cheese');

router.post('/', (req, res) => {

    console.log(req.session);

    if (!req.session.key) {

        loginController.findAdmin(req).then((result) => {
            req.session.key = result;
            res.status(200).json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });

    } else {

        console.log('REDIS:');

        logger.fatal(`Inicio session: ${JSON.stringify(req.session.key.user)}`);

        fs.readFile('./sessions.log', (err, file) => {

            if (err) console.log('read log');

            const logParam = {
                Bucket: 'svoice',
                Key: `logs/redis/${file}`,
                Body: file,
            };

            const logS3 = new AWS.S3();

            logS3.upload(logParam, function(err, data) {
                if (err) console.log('upload log');
                console.log('file uploaded');
            });

        });

        res.status(200).json(req.session.key);
    }
});

module.exports = router;