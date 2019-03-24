const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    names: { type: String, require: [true, 'A name is require'] },
    lastnames: { type: String, require: [true, 'A lastname is require'] },
    email: { type: String, unique: true, require: [true, 'A valid email is require'] },
    password: { type: String, require: [true, 'A password is require'] },
    status: { type: String, default: 'Activo' },
    company: { type: String, require: [true, 'A company name is require'] },
});

adminSchema.plugin(uniqueValidator, { message: 'the {PATH} must be unique' });

module.exports = mongoose.model('Admin', adminSchema);