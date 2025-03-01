const Sequelize = require('sequelize');
const db = require('../config/db');

const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas',
{
    id : {
        type:Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1),
});

Tareas.belongsTo(Proyectos); //Relación de pertenencia uno a uno o uno a muchos (Una tarea pertence a un proyecto

module.exports = Tareas;
