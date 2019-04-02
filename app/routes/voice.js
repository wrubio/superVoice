const router = require('express').Router();
const fileUpload = require('express-fileupload');
const voiceController = require('../controllers/voiceController');

// default options
router.use(fileUpload());

router.get('/', (req, res) => {
    voiceController.getAllVoice(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err);
    })
});

/**
 * Route for uploads voices
 */
router.post('/', (req, res) => {
    voiceController.loadVoice(req).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(err.status).json(err);
    });
});

module.exports = router;