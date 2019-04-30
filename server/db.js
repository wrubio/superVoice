const Sequelize = require('sequelize');
const administradorModel = require('./app/models/administrador');
const concursoModel = require('./app/models/concurso');
const registroModel = require('./app/models/registro');


const sequelize = new Sequelize('', '', '', {
  host: '',
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
const Concurso = concursoModel(sequelize, Sequelize);
const Registro = registroModel(sequelize, Sequelize);

//associations
Concurso.belongsTo(Administrador);
Registro.belongsTo(Concurso);

// force: true will drop the table if it already exists
sequelize.sync({ force: true }).then(() => {
  // Table created
  populateDB();
});

function populateDB() {
  Administrador.create({
    nombres: 'John',
    apellidos: 'Doe',
    correo: 'test@example.com',
    contrasena: 'password',
    estado: 'active',
    nombreEmpresa: 'testEmpresa'
  });
  Concurso.create({
    nombreConcurso: "concursoTest",
    fechaInicio: "2019-01-15T11:39:43.000Z",
    fechaFin: "2019-02-15T11:39:43.000Z",
    valorPagar: 88,
    guion: "test de un guion por el concurso de test",
    recomendaciones: "son las recomendaciones de este concurso",
    rutaImagen: "C:/documents/Baptiste/cloud/proyecto1/images/testImage",
    nombreURL: "UrlTest",
    estadoPublicacion: "no publicado",
    administradorId: "1"
  });
  Registro.create({
    rutaArchivoOriginal: "http://ec2-34-228-158-8.compute-1.amazonaws.com:4000/uploads/contests/t/TestArquitecturaA/converted/2-1552575622473.mp3",
    rutaArchivoConvertida: "http://ec2-34-228-158-8.compute-1.amazonaws.com:4000/uploads/contests/t/TestArquitecturaA/converted/2-1552575622473.mp3",
    estadoRegistroVoces: "no convertida",
    nombresLocutor: "Alphonse Pierre",
    apellidosLocutor: "Brown Smith",
    correoLocutor: "alphonse.brown@example.com",
    observacionesLocutor: "disculpa estoy un poco enfermo por eso mi voz no esta fuerte",
    concursoId: 1,  
  });
};

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
