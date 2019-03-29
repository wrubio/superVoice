const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.post('/', (req, res) => {
    loginController.findAdmin(req).then((result) => {
        //console.log(result.user.correo);
        //req.session.key = foundAdmin.correo;
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err);
    });
});

module.exports = router;