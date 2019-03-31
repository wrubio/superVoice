const router = require('express').Router();
const fileUpload = require('express-fileupload');
const s3imgController = require('../controllers/s3imgController');

// default options
router.use(fileUpload());

/**
 * Route for uploads img to the created contests
 */
router.post('/', (req, res) => {
    s3imgController.loadImg(req).then((result) => {
        res.status(201).json(result);
    }).catch((err) => {
        res.status(err.status).json(err);
    });
});

module.exports = router;