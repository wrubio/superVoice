const express = require('express');
const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.post('/', (req, res) => {
    console.log(req.session);
    if (!req.session.key) {
        loginController.findAdmin(req).then((result) => {
            console.log(result);
            req.session.key = result;
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    } else {
        console.log('por aca entro!');
        res.status(200).json(req.session.key);
    }
});

module.exports = router;