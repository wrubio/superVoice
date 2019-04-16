const dbVoice = require('./updateVoice');
const AWS2 = require('aws-sdk');

// Load your AWS credentials and try to instantiate the object.
AWS2.config.loadFromPath(__dirname + '/config2.json');

const urlWeb = 'http://ec2-3-84-141-254.compute-1.amazonaws.com:4005';

function sendMail(data) {
    return new Promise((resolve, reject) => {
        let params = {
            Destination: {
                ToAddresses: [`${data.correoLocutor}`]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<h1>superVoice</h1>
                    <br>
                    <p>Hola ${data.nombresLocutor}, nos complace informarte, que tu voz subida en el concurso ${data.url} ya esta <b>publicada</b><br>
                    puedes escuchar tu superVoces en el siguiente link:</p>
                    <a href="${urlWeb}/#/contest/${data.url}">Link al concurso ${data.url}</a>
                    <br><br>
                    <p>Recuerda visitarnos seguidamente para que puedas mejorar tu voz con las que puedes ver en la página del concurso</p>
                    <br><br>
                    Atentamente,
                    <br><br>
                    Equipo de SuperVoice
                    `
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: "TEXT_FORMAT_BODY"
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Hello ✔ - Tu voz del concurso ya es lista'
                }
            },
            Source: 'supervoicescontest@gmail.com'
        };

        // Create the promise and SES service object
        const sendPromise = new AWS2.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

        sendPromise.then((result) => {

            data.mail = 1;
            dbVoice.updateVoice(data).then((updatedVoice) => {
                resolve(updatedVoice);
            }).catch((err) => {
                reject(err);
            });

        }).catch((err) => {
            reject({ ok: false, message: 'send Mail', errors: err });
        });
    });
}

module.exports = {
    sendMail
}