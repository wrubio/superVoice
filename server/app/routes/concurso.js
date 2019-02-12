const router = require('express').Router();
const concursoService = require('../controllers/concurso-controller');

router.get('/', concursoService.getAllConcursos);
router.get('/:id(\\d+)', concursoService.getConcursoById);
router.post('/', concursoService.createConcurso);
router.put('/:id(\\d+)', concursoService.updateConcurso);
router.delete('/:id(\\d+)', concursoService.deleteConcurso);

router.get('/admin/:id(\\d+)', concursoService.getAllConcursosByAdmin);

module.exports = router;
