const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

app.post('/', (req, res) => {
    const emails = req.body;
    const mailOptions = async(emails) => {
        console.log(emails);
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'supervoicescontest@gmail.com', // generated ethereal user
                pass: 'superVoices2019$' // generated ethereal password
            }
        });
        let mailOptions = {
            from: '"SuperVoices 👻" <supervoicescontest@gmail.com>', // sender address
            to: emails, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Nos interesas!", // plain text body
            html: "<b>Hello world?</b>" // html body
        };
        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    }
    mailOptions(emails).then(resp => {
        res.status(200).json({ ok: true })
    }).catch(err => {
        res.status(200).json({ ok: false })
    })
})

module.exports = app;


/*


/*
async function sendAudioData(path, voice) {
    return new Promise((resolve, reject) => {
        requestify.put(path, voice).then(resp => {
            console.log(resp.body);
            resolve({ ok: true });
        }).catch(err => {
            reject({ ok: false, errors: err });
        })
    });
};

function getContest(id) {
    let algo = request.get(`${urlDB}/concurso/${id}`, (err, resp, body) => {
        if (err) {
            return console.log(err);
        } else {
            let contest = JSON.parse(body);
            voiceToConvert
            return contest;
            // mailOptions(voice, contest);
        }
    })
    return algo;
}
// configurando el nuevo path del mp3
const splitOriginalPath = voice.rutaArchivoOriginal.split('voices');
// Asignando los nuevo valores al modelo de base de datos de los audios
voice.rutaArchivoConvertida = `${splitOriginalPath[0]}converted/${nameAudio}.mp3`;
voice.estadoRegistroVoces = 'Generada';
// Path para el PUT de actualizacion del audio
const path = `${urlDB}/registro/${voice.concursoId}`;
// Envia los cambios de la conversion con la nueva ruta

requestify.put(path, voice).then(resp => {
    resolve({ ok: true });
}).catch(err => {
    reject({ ok: false, errors: err });
})



/*
let mailOptions = (id, voice) => {
    request.get(`${urlDB}/concurso/${id}`, (err, resp, body) => {
        if (err) {
            console.log(err);
        } else {
            let contest = JSON.parse(body);
                // mailOptions(voice, contest);
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'supervoicescontest@gmail.com', // generated ethereal user
                    pass: 'superVoices2019$' // generated ethereal password
                }
            });
            let mailOptions = {
                from: '"SuperVoices 👻" <supervoicescontest@gmail.com>', // sender address
                to: voice.correoLocutor,
                subject: "Hello ✔ - Tu voz del concurso ya es lista",
                text: "Tu superVOice ya está lista!",
                html: `<h1>superVoice</h1>
                <br>
                <p>Hola ${voice.nombresLocutor}, nos complace informarte, que tu voz subida en el concurso ${contest.nombreConcurso} ya esta <b>publicada</b><br>
                puedes escuchar tu superVoces en el siguiente link:</p>
                <a href="${urlWeb}/${contest.nombreURL}">Link al concurso ${contest.nombreConcurso}</a>
                <br><br>
                <p>Recuerda visitarnos seguidamente para que puedas mejorar tu voz con las que puedes ver en la página del concurso</p>
                <br><br>
                Atentamente,
                <br><br>
                Equipo de SuperVoice
                `
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(ok);
                }
            });

            // console.log("Message sent: %s", info.messageId);
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // return info;
        }
    })

}

/**
 * Promese - Convierte los audios pendientes con ffmpeg
 * @param {*} audio 
 * @param {*} path 
 * @param {*} nameAudio 
 * @param {*} voice 
 * @param {*} url 
 
async function convertAudio(audio, path, nameAudio, voice, url) {
    return new Promise((resolve, reject) => {

        ffmpeg(audio).toFormat('mp3')
            .on('error', (err) => {
                console.log('El archivo no se pudo convertir')
                reject({ ok: false });
            })
            .on('progress', (progress) => { console.log(`Processing: ${progress.targetSize} KB converted`); })
            .on('end', () => {
                console.log('El archivo se convirtio correctamente');
                resolve({ ok: true });
            })
            .save(`${path}/${nameAudio}.mp3`);
    })
}
*/