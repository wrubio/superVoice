const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voiceSchema = new Schema({
    rutaArchivoOriginal: { type: String },
    rutaArchivoConvertida: { type: String },
    estadoRegistroVoces: { type: String },
    nombresLocutor: { type: String, require: [true, 'A name is require'] },
    apellidosLocutor: { type: String, require: [true, 'A lastname is require'] },
    correoLocutor: { type: String, require: [true, 'A email is require'] },
    observacionesLocutor: { type: String },
    adminId: { type: String },
    contestId: { type: String },
    url: { type: String },
    mail: { type: String }
}, { collection: 'voices' });

module.exports = mongoose.model('Voice', voiceSchema);