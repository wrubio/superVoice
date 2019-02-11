const Sequelize = require('sequelize');
const administradorModel = require('./app/models/administrador');
const concursoModel = require('./app/models/concurso');
const registroModel = require('./app/models/registro');


const sequelize = new Sequelize('test', 'sa', 'Uniandes2019.', {
  host: '13.92.245.47',
  dialect: 'mssql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

});

const Administrador = administradorModel(sequelize, Sequelize);
const Concurso = concursoModel(sequelize,Sequelize);
const Registro = registroModel(sequelize, Sequelize);

//associations
Concurso.belongsTo(Administrador);
Registro.belongsTo(Concurso);

// force: true will drop the table if it already exists
sequelize.sync({ force: true }).then(() => {
    // Table created
    return Administrador.create({
        nombres: 'John',
        apellidos: 'Doe',
        correo: 'test@example.com',
        contrasena: 'password',
        estado: 'active',
        nombreEmpresa : 'testEmpresa'
    });
});
/**
Administrador.findAll().then(admins => {
  console.log(admins)
})
*/
/**
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
*/
  module.exports = {
      sequelize,
      Administrador,
      Registro,
      Concurso,
  }