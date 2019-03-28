const router = require('express').Router();
const contestController = require('../controllers/contestController');

router.get('/', (req, res) => {
    contestController.getContest().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err.errors);
    });
});

// router.get('/:id(\\d+)', concursoController.getConcursoById);


router.post('/', (req, res) => {
    contestController.createContest(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err.errors);
    });
});
// router.put('/:id(\\d+)', concursoController.updateConcurso);
// router.delete('/:id(\\d+)', concursoController.deleteConcurso);

// router.get('/admin/:id(\\d+)', concursoController.getAllConcursosByAdmin);

module.exports = router;