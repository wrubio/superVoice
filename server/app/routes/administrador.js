const router = require('express').Router();
const administradorController = require('../controllers/administrador-controller');

router.get('/', administradorController.getAllAdministradors);
router.get('/:id(\\d+)', administradorController.getAdministradorById);
router.post('/', administradorController.createAdministrador);
router.put('/:id(\\d+)', administradorController.updateAdministrador);
router.delete('/:id(\\d+)', administradorController.deleteAdministrador);

module.exports = router;

