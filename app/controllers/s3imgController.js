// Load the SDK for JavaScript
const AWS = require('aws-sdk');

// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/config.json');

// type of image
const typeImg = ['jpg', 'jpeg', 'png', 'gif'];

// Agrupa el nombre del concurso en una sola palabra
function createName(contestName) {
    if (contestName.indexOf(' ') >= 0) {
        const splitName = contestName.split(' ');
        const lengthSplitName = splitName.length;
        let newContestName = '';
        for (let i = 0; i < lengthSplitName; i++) {
            newContestName += splitName[i];
        }
        contestName = newContestName;
        return contestName;
    } else {
        return contestName;
    }
}

/**
 * Configuracion de la imagen antes de subirla al servicio S3
 * @param {*} req 
 */
function loadImg(req) {
    return new Promise((resolve, reject) => {

        if (!req.files) reject({ ok: false, status: 400, message: 'Img data vacia' });

        // get file ext
        const fileToUpload = req.files.img;
        const fileExt = fileToUpload.name.split('.').pop();

        // validate file ext
        if (typeImg.indexOf(fileExt.toLowerCase()) < 0) {
            reject({ ok: false, status: 400, message: `Las extenciones validas de imagenes son ${typeImg.join(', ')}` });
        }

        const userID = req.query.id;
        let contestName = req.query.contest;
        const update = req.query.update;
        const oldContestName = req.query.oldName;

        // Agrupa en nombre del concurso en una sola palabra
        contestName = createName(contestName);

        // Set new name to the file
        const newFileName = `${userID}-${new Date().getTime()}.${fileExt}`;

        // const buffer = Buffer.from(fileToUpload.data, 'utf8');

        const s3 = new AWS.S3();

        s3.createBucket(() => {
                const params = {
                    Bucket: 'svoice',
                    Key: `${userID}/${contestName}/${newFileName}`,
                    Body: fileToUpload.data,
                    ACL: 'public-read'
                };

                s3.upload(params, function(err, data) {
                    if (err) reject({ ok: false, status: 500, errors: err });
                    resolve(data);
                });
            })
            // console.log(fileToUpload);
    });
}

module.exports = {
    loadImg
}