const router = require('express').Router();
const contestController = require('../controllers/contestController');

router.get('/', (req, res) => {
    contestController.getContests().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err.errors);
    });
});

router.get('/:id', (req, res) => {
    contestController.getContestById(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err.errors);
    })
});


router.post('/', (req, res) => {
    contestController.createContest(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err.errors);
    });
});

router.put('/:id', (req, res) => {
    contestController.editContest(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err.errors);
    });
});

router.delete('/:id', (req, res) => {
    contestController.deleteContest(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

// router.get('/admin/:id(\\d+)', concursoController.getAllConcursosByAdmin);

module.exports = router;