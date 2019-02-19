const Sequelize = require('sequelize');
const Administrador = require('./administrador');

module.exports = (sequelize, type) => {
    return sequelize.define('concurso', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombreConcurso: {
            type: Sequelize.STRING
        },
        fechaInicio: {
            type: Sequelize.DATE
        },
        fechaFin: {
            type: Sequelize.DATE
        },
        valorPagar: {
            type: Sequelize.DOUBLE
        },
        guion: {
            type: Sequelize.TEXT
        },
        recomendaciones: {
            type: Sequelize.TEXT
        },
        rutaImagen: {
            type: Sequelize.STRING
        },
        nombreURL: {
            type: Sequelize.STRING,
            unique: true
        },
        estadoPublicacion: {
            type: Sequelize.STRING
        }
    });
}