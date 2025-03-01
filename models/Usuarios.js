const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Proyectos = require('./Proyectos');

// TODO: Creamos la tabla usuarios 
const Usuarios = db.define('usuarios',
{ 
    id : {
        type:Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email : {
        type:Sequelize.STRING(60),
        allowNull : false,
        validate: {
            isEmail: {
               msg: 'Agrega un correo valido' 
            },
            notEmpty: {
                msg: 'El email no puede ir vacio' 
             }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password : {
        type:Sequelize.STRING(60),
        allowNull : false,
        validate: {
            notEmpty: {
               msg: 'El password no puede ir vacio' 
            }
        },
    },
    activo:
    {
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, 
{
    hooks:{
        beforeCreate(usuario)
        {
            // console.log('Creando el usuario')
            // console.log(usuario);
            usuario.password=bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
} 
);

// TODO: Crear metodo personalizados para el modelo Usuario
Usuarios.prototype.verificarPassword = function(password)
{
    return bcrypt.compareSync(password, this.password); 
}

Usuarios.hasMany(Proyectos); //Relación de pertenencia uno a muchos (Un usuario puede crear varios proyectos

module.exports = Usuarios;
