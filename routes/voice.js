const express = require('express');
const fileUpload = require('express-fileupload');
// const fs = require('fs');
const fs = require('fs-extra');

const app = express();

// default options
app.use(fileUpload('createParentPath', false));

// type of image
const typeVoice = ['mp3', 'wav', 'ogg'];

app.post('/', (req, res) => {
    // res.status(200).json({ ok: true, data: req.query });
    // console.log(req.files);
    if (!req.files) {
        res.status(500).json({ ok: true, error: 'Debe seleccionar un archivo de tipo audio' });
    }
    // console.log(req.query);
    // get file ext
    const fileToUpload = req.files.audio;
    const fileExt = fileToUpload.name.split('.').pop();

    // validate file ext
    if (typeVoice.indexOf(fileExt.toLowerCase()) < 0) {
        return res.status(400).json({
            ok: false,
            message: `Las extenciones validas de imagenes son ${typeVoice.join(', ')}`
        })
    }
    // console.log(req.query.userId);
    const userId = req.query.userId;
    const contestId = req.query.contestId;
    let contestName = req.query.contestName;

    if (contestName.indexOf(' ') >= 0) {
        const splitName = contestName.split(' ');
        const lengthSplitName = splitName.length;
        let i = 0;
        let newContestName = '';
        for (i; i < lengthSplitName; i++) {
            newContestName += splitName[i];
        }
        contestName = newContestName;
    }

    // Set new name to the file
    const newFileName = `${userId}-${new Date().getTime()}.${fileExt}`;

    // Create voices folder if this doesn't exist
    const voicesFolder = `./dist/uploads/contests/${userId}/${contestName}/voices`;
    if (!fs.existsSync(voicesFolder)) fs.mkdirSync(voicesFolder);

    // Path de almacenamiento del archivo
    const savePath = `./dist/uploads/contests/${userId}/${contestName}/voices/${newFileName}`;

    // Sube el achivo enviado
    const buffer = Buffer.from(fileToUpload.data, 'utf8');
    fs.writeFile(savePath, buffer, 'base64', function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: `ups!!! El archivo ${fileToUpload.name} no pudo guardarse`,
                error: err
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Archivo subio correctamente',
            ext: fileExt,
            fileUpload: fileToUpload.name,
            newFileName: newFileName,
            path: savePath,
        })
    });
})

module.exports = app;