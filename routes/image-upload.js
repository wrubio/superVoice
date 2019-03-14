const express = require('express');
const fileUpload = require('express-fileupload');
// const fs = require('fs');
const fs = require('fs-extra');

const app = express();

// default options
app.use(fileUpload('createParentPath', false));

// type of image
const typeImg = ['jpg', 'jpeg', 'png', 'gif'];

// Agrupa el nombre del concurso en una sola palabra
function createName(contestName) {
    if (contestName.indexOf(' ') >= 0) {
        const splitName = contestName.split(' ');
        const lengthSplitName = splitName.length;
        let i = 0;
        let newContestName = '';
        for (i; i < lengthSplitName; i++) {
            newContestName += splitName[i];
        }
        contestName = newContestName;
        return contestName;
    } else {
        return contestName;
    }
}

/**
 * Guarda imagen del concurso a crear
 * @param userID {Concurso} concurso
 * @param contestName {Concurso} concurso
 * @return {Promise<imageInformation>} los datos de la imagen guardada con el epth
 */
app.post('/', (req, res) => {

    if (!req.files) {
        if (req.query.update) {
            const newName = createName(req.query.contest);
            const pthContest = `./dist/uploads/contests/${req.query.id}/${createName(req.query.oldName)}`;
            const newNameFolder = `./dist/uploads/contests/${req.query.id}/${newName}`;
            fs.rename(pthContest, newNameFolder, function(err) {
                if (err) return res.status(500).json(err);
                fs.readdir(newNameFolder, (err, files) => {
                    if (err) return res.status(500).json(err);
                    if (files.length > 0) {
                        const currentImg = files[0];
                        res.status(200).json({ ok: true, newPath: `uploads/contests/${req.query.id}/${newName}/${currentImg}` });
                    }
                });
            });
        } else {
            return res.status(400).json({ ok: false });
        }
    };

    if (req.files) {
        // get file ext
        const fileToUpload = req.files.img;
        const fileExt = fileToUpload.name.split('.').pop();

        // validate file ext
        if (typeImg.indexOf(fileExt.toLowerCase()) < 0) {
            return res.status(400).json({
                ok: false,
                error: 1,
                message: `Las extenciones validas de imagenes son ${typeImg.join(', ')}`
            })
        }

        const userID = req.query.id;
        let contestName = req.query.contest;
        const update = req.query.update;
        const oldContestName = req.query.oldName;

        // Agrupa en nombre del concurso en una sola palabra
        contestName = createName(contestName);

        // Set new name to the file
        const newFileName = `${userID}-${new Date().getTime()}.${fileExt}`;

        // Create user folder if this doesn't exist
        const userPath = `./dist/uploads/contests/${userID}`;
        if (!fs.existsSync(userPath)) fs.mkdirSync(userPath);

        // Create contest folder if this doesn't exist
        const contestPath = `./dist/uploads/contests/${userID}/${contestName}`;
        if (!fs.existsSync(contestPath)) {
            if (update === true) {
                const oldNamePath = `./dist/uploads/contests/${userID}/${createName(oldContestName)}`;
                fs.rename(oldNamePath, contestPath, function(err) {
                    if (err) return res.status(500).json({ ok: false, menssage: 'No se pudo cambiar nombre de carpeta', errors: err });
                })
            } else {
                console.log(update);
                fs.mkdirSync(contestPath);
            }
        } else {
            if (update === false) {
                return res.status(500).json({ ok: false, error: 0, message: `Ya existe un concurso con el nombre ${contestName}` });
            }
        }

        const savePath = `./dist/uploads/contests/${userID}/${contestName}/${newFileName}`;

        // Borra archivo de la carpeta del concurso existente para dejar una sola imagen
        fs.readdir(contestPath, (err, files) => {
            if (err) return res.status(500).json(err);
            if (files.length > 0) {
                const currentImg = `${contestPath}/${files[0]}`
                fs.unlinkSync(currentImg);
            }
        });

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
    }
})

app.delete('/', (req, res) => {
    const userId = req.query.userId;
    const folderName = req.query.name;
    const contestPath = `./dist/uploads/contests/${userId}/${folderName}`;
    if (fs.existsSync(contestPath)) {
        fs.removeSync(contestPath);
        res.status(200).json({ ok: true, deleteFolder: folderName });
    } else {
        res.status(500).json({ ok: false, data: `Concurso con nombre ${folderName} no existe` });
    }
});

module.exports = app;