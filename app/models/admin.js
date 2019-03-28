const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    nombres: { type: String, require: [true, 'A name is require'] },
    apellidos: { type: String, require: [true, 'A lastname is require'] },
    correo: { type: String, unique: true, require: [true, 'A valid email is require'] },
    contrasena: { type: String, require: [true, 'A password is require'] },
    estado: { type: String, default: 'Activo' },
    nombreEmpresa: { type: String, require: [true, 'A company name is require'] },
});

adminSchema.plugin(uniqueValidator, { message: 'the {PATH} must be unique' });

module.exports = mongoose.model('Admin', adminSchema);