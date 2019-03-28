const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const contestSchema = new Schema({
    nombreConcurso: { type: String, require: [true, 'A contest name is require'] },
    fechaInicio: { type: Date, default: Date.now },
    fechaFin: { type: Date, default: Date.now },
    valorPagar: { type: String, require: [true, 'A value is require'] },
    guion: { type: String, require: [true, 'A guion is require'] },
    recomendaciones: { type: String, require: [true, 'A recomendation is require'] },
    rutaImagen: { type: String, require: [true, 'A url img is require'] },
    nombreURL: { type: String, unique: true, require: [true, 'A url name is require'] },
    estadoPublicacion: { type: String, default: 'publicado' },
    administradorId: { type: String }
}, { collection: 'contests' });

contestSchema.plugin(uniqueValidator, { message: 'the {PATH} must be unique' });

module.exports = mongoose.model('Contest', contestSchema);