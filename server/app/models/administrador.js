const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('administrador', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombres: {
            type: Sequelize.STRING
        },
        apellidos: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING,
            unique: true
        },
        contrasena: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.STRING
        },
        nombreEmpresa: {
            type: Sequelize.STRING
        }
    });
}