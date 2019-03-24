const router = require('express').Router();
const adminController = require('../controllers/adminController');
// var authToken = require('../../middleware/auth');

// router.get('/', administradorController.getAllAdministradors);
// router.get('/:id(\\d+)', administradorController.getAdministradorById);
router.post('/', (req, res) => {
    adminController.createAdmin(req).then((result) => {
        res.status(201).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
});
// router.put('/:id(\\d+)', authToken.verifyToke, administradorController.updateAdministrador);
// router.delete('/:id(\\d+)', authToken.verifyToke, administradorController.deleteAdministrador);

module.exports = router;