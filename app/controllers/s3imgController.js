const s3ImgService = require('../services/s3imgService');

// type of image
const typeImg = ['jpg', 'jpeg', 'png', 'gif'];

/**
 * Configuracion de la imagen antes de subirla al servicio S3
 * @param {*} req 
 */
function loadImg(req) {
    return new Promise((resolve, reject) => {
        console.log(req.files);
        if (!req.files) reject({ ok: false, status: 400, message: 'Img data vacia' });

        // get file ext
        const fileToUpload = req.files.img;
        const fileExt = fileToUpload.name.split('.').pop();

        // validate file ext
        if (typeImg.indexOf(fileExt.toLowerCase()) < 0) {
            reject({ ok: false, status: 400, message: `Las extenciones validas de imagenes son ${typeImg.join(', ')}` });
        }

        const userID = req.query.id;
        const contestID = req.query.contest;
        const update = req.query.update;

        // Set new name to the file
        const newFileName = `${userID}-${new Date().getTime()}.${fileExt}`;
        const params = {
            Bucket: 'svoice',
            Key: `${userID}/${contestID}/${newFileName}`,
            Body: fileToUpload.data,
            ACL: 'public-read'
        };

        console.log(userID, update, contestID);

        if (update === 'true') {
            s3ImgService.updateImage(params, userID, contestID).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }

        s3ImgService.uploadImg(params, contestID).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });

    });
}

module.exports = {
    loadImg
}