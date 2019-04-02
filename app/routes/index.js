const router = require('express').Router();

//Dispatch the child routes
router.use('/administrador', require('./admin'));
router.use('/concurso', require('./contest'));
router.use('/registro', require('./voice'));
router.use('/login', require('./login'));
router.use('/imageUpload', require('./s3img'));


// 404 Not found
router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;