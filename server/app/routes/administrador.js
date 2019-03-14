const router = require('express').Router();
const administradorController = require('../controllers/administrador-controller');
var authToken = require('../../middleware/auth');

router.get('/', administradorController.getAllAdministradors);
router.get('/:id(\\d+)', administradorController.getAdministradorById);
router.post('/', administradorController.createAdministrador);
router.put('/:id(\\d+)', authToken.verifyToke, administradorController.updateAdministrador);
router.delete('/:id(\\d+)', authToken.verifyToke, administradorController.deleteAdministrador);

module.exports = router;