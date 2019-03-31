var async = require('async');
const AWS = require('aws-sdk');
const Contest = require('../models/contest');

// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/config.json');

/**
 * This function upload new img and create the Key of the img with the userID folder
 * and the contestID folder
 * @param {Object} params 
 * @param {String} contestID 
 */
function uploadImg(params, contestID) {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3();
        s3.upload(params, function(err, data) {
            if (err) reject({ ok: false, status: 500, errors: err });

            Contest.findById(contestID, (err, contestFound) => {
                if (err) reject({ ok: false, status: 500, errors: err });
                if (!contestFound) reject({ ok: false, status: 400, errors: err });

                contestFound.rutaImagen = data.Location;

                contestFound.save((err, savedContest) => {
                    if (err) reject({ ok: false, status: 500, errors: err });
                    resolve({ ok: true, contest: savedContest });
                });
            });

        });
    });
}

/**
 * This function delete any img file in the contest folder, after that upload the
 * new img and return de Location of the S3 Object.
 * @param {Object} params 
 * @param {String} userID 
 * @param {String} contestID 
 */
function updateImage(params, userID, contestID) {
    return new Promise((resolve, reject) => {

        const s3 = new AWS.S3();

        s3.listObjects({ Bucket: 'svoice', Prefix: `${userID}/${contestID}/` }, (err, data) => {
            if (data.Contents.length) {
                let keyObject;
                data.Contents.forEach((file) => {
                    let isObject = file.Key.split('/').pop();
                    if (isObject) keyObject = file.Key;
                });
                s3.deleteObject({ Bucket: 'svoice', Key: keyObject }, (err, data) => {
                    if (err) reject({ ok: false, status: 500, errors: err });
                    s3.upload(params, (err, data) => {
                        if (err) reject({ ok: false, status: 500, errors: err });
                        console.log(data);

                        Contest.findById(contestID, (err, contestFound) => {
                            if (err) reject({ ok: false, status: 500, errors: err });
                            if (!contestFound) reject({ ok: false, status: 400, errors: err });

                            contestFound.rutaImagen = data.Location;

                            contestFound.save((err, savedContest) => {
                                if (err) reject({ ok: false, status: 500, errors: err });
                                resolve({ ok: true, contest: savedContest });
                            });
                        });

                    });
                });
            }
        });
    });
}

module.exports = {
    uploadImg,
    updateImage
}