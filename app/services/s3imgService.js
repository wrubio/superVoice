var async = require('async');
const AWS = require('aws-sdk');
const Contest = require('../models/contest');

// Load your AWS credentials and try to instantiate the object.
AWS.config.loadFromPath(__dirname + '/config.json');

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

function copyDeleteFolder(id, newContestName, oldContestName) {
    return new Promise((resolve, reject) => {
        const done = function(err, data) {
            if (err) reject({ ok: false, status: 500, erros: err });
            resolve(data);
        };

        const s3 = new AWS.S3();

        const oldPath = `${id}/${oldContestName}`;
        const newPath = `${id}/${newContestName}`;

        s3.listObjects({ Bucket: 'svoice', Prefix: oldPath }, (err, data) => {
            if (data.Contents.length) {
                async.each(data.Contents, (file, cb) => {
                    let params = {
                        Bucket: 'svoice',
                        CopySource: `svoice/${file.Key}`,
                        Key: `${file.Key.replace(oldPath, newPath)}`
                    };
                    s3.copyObject(params, (copyErr, copyData) => {
                        if (copyErr) console.log(copyErr);
                        cb();
                    });
                }, done);
            }
        });
    });
}
module.exports = {
    uploadImg,
    copyDeleteFolder
}