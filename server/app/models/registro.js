const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('registro', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rutaArchivoOriginal: {
            type: Sequelize.STRING
        },
        rutaArchivoConvertida: {
            type: Sequelize.STRING
        },
        estadoRegistroVoces: {
            type: Sequelize.STRING
        },
        nombresLocutor: {
            type: Sequelize.STRING
        },
        apellidosLocutor: {
            type: Sequelize.STRING
        },
        correoLocutor: {
            type: Sequelize.STRING
        },
        observacionesLocutor: {
            type: Sequelize.TEXT
        },
    });
}
