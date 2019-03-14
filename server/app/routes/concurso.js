const router = require('express').Router();
const concursoController = require('../controllers/concurso-controller');

router.get('/', concursoController.getAllConcursos);
router.get('/:id(\\d+)', concursoController.getConcursoById);
router.post('/', concursoController.createConcurso);
router.put('/:id(\\d+)', concursoController.updateConcurso);
router.delete('/:id(\\d+)', concursoController.deleteConcurso);

router.get('/admin/:id(\\d+)', concursoController.getAllConcursosByAdmin);

module.exports = router;