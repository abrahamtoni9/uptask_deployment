const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug'); 

const shortid = require('shortid'); 

const Proyectos = db.define('proyectos',{
    id : {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING,
}, 
{
    hooks:{
        beforeCreate( proyecto )
        {
            console.log('Antes de insertar en la base de datos');
            const url = slug(proyecto.nombre).toLocaleLowerCase();
            // proyecto.url = url;
            proyecto.url = `${url} - ${shortid.generate()}`;
        },
        beforeUpdate( proyecto )
        {
            // console.log('Antes de insertar en la base de datos');
            const url = slug(proyecto.nombre).toLocaleLowerCase();
            console.log('URL = ', url);
            // proyecto.url = url;
            proyecto.url = `${url} - ${shortid.generate()}`;
        }
    } 
});

module.exports = Proyectos;
