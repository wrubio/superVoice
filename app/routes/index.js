const router = require('express').Router();

//Dispatch the child routes
router.use('/administrador', require('./admin'));
// router.use('/concurso', require('./concurso'));
// router.use('/registro', require('./registro'));
// router.use('/login', require('./login'));


// 404 Not found
router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;