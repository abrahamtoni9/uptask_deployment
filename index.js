// TODO: import express from 'express';// import con ES6 y no soporta Express
const express = require('express');//Express soporta esta sintaxis
const routes = require('./routes');
const path = require('path'); 
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// TODO:extraer valores de variables .env
require('dotenv').config( { path:'variables.env' } );



// TODO: helpers con algunas funciones
const helpers = require('./helpers');

// TODO: Importamos el modulo de conexion 
const db = require('./config/db');

// TODO: Importamos el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// TODO: Sincronizamos el modelo a la base de datos 
db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .then(error => console.log(error));

// TODO: Instanciamos el servidor de Express
const app = express();

//TODO: Habilitar los archivos estaticos
app.use(express.static('public'));

// TODO: Habilitar template-engine PUB
app.set('view engine','pug');

// TODO: Habilitar el uso del body parser para poder manejar formularios por POST
app.use( bodyParser.urlencoded( { extended:true } ) );

// TODO: Añadir la carpeta vistas 
app.set('views', path.join(__dirname, './views'));

// TODO: Agregar flash messages
app.use(flash());

// TODO: Agregar cookie - parser
app.use(cookieParser());

// TODO: Agrega la libreria session y pasala como variable a cada request, nos permite navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret:'secretClaveSecreta', //clave secreta para codificar las sesiones
    saveUninitialized: true, //guarda las sesiones que no se inician con un request http
    resave: false //no vuelva a guardar una sesión si no ha cambiado
}));

// TODO: Configuracion de la autenticacion
app.use(passport.initialize());
app.use(passport.session());

// TODO: Pasar como funcion global el modulo "vardump" al proyecto
app.use((req, res, next) => 
    {
        // console.log(req.user);
        res.locals.vardump = helpers.vardump;//vamos a usar esta función "vardump" en todas las vistas
        res.locals.mensajes = req.flash();//vamos a usar esta función "mensajes" en todas las vistas
        res.locals.usuario = {...req.user} || null;//vamos a usar esta función "usuario" en todas las vistas        
        // console.log(res.locals.usuario);
        next();
    }
)// TODO: recuerda que "use" se ejecuta en todos los distintos verbos que tenemos de HTTP como GET POS, PUT, DELETE
 


app.use((req, res, next) => 
    {
        const fecha =   new Date();
        res.locals.year = fecha.getFullYear();
        // console.log("Yo soy middleware");
        next();
    }
)// TODO: recuerda que "use" se ejecuta en todos los distintos verbos que tenemos de HTTP como GET POS, PUT, DELETE


// TODO: prueba de peticion de peticion get, post, put, delete 
app.use((req, res, next) => 
    {
        // console.log("Yo soy otro middleware");
        next();
    }
)

require('./handlers/email');

app.use('/', routes());

const host = process.env.HOST|| '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port,host, ()=>{
    console.log(`Servidor escuchando en el puerto ${port}`);
});

















// TODO: localhost:3000

// TODO: ejecutamos el comando "npm install" para restaurar todas las dependencias 


