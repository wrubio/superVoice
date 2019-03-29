const router = require('express').Router();
const fileUpload = require('express-fileupload');
const s3imgController = require('../controllers/s3imgController');

// default options
router.use(fileUpload());

// router.get('/', administradorController.getAllAdministradors);
// router.get('/:id(\\d+)', administradorController.getAdministradorById);

/**
 * Ruta para crear nuevos concursos de la plataforma de superVoice
 */
router.post('/', (req, res) => {
    s3imgController.loadImg(req).then((result) => {
        res.status(201).json(result);
    }).catch((err) => {
        res.status(err.status).json(err);
    });
});
// router.put('/:id(\\d+)', authToken.verifyToke, administradorController.updateAdministrador);
// router.delete('/:id(\\d+)', authToken.verifyToke, administradorController.deleteAdministrador);

module.exports = router;