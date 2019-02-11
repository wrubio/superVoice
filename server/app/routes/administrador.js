const router = require('express').Router();
const administradorController = require('../controllers/administrador-controller');

router.get('/', administradorController.getAllAdministradors);
router.get('/:id(\\d+)', administradorController.getAdministradorById);
router.post('/', administradorController.createAdministrador);

module.exports = router;

