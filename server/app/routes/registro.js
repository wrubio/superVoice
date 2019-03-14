const router = require('express').Router();
const registroController = require('../controllers/registro-controller');

router.get('/', registroController.getAllRegistros);
router.get('/:id(\\d+)', registroController.getRegistroById);
router.post('/', registroController.createRegistro);
router.put('/:id(\\d+)', registroController.updateRegistro);
router.delete('/:id(\\d+)', registroController.deleteRegistro);

router.get('/concurso/:id(\\d+)', registroController.getAllRegistrosByConcurso);

module.exports = router;
