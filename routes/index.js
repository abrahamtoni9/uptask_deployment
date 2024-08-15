const express = require('express');
const router = express.Router();

// TODO: Importamos la libreria express validator 
const {body}  = require('express-validator');

// TODO: Importamos el controlador de proyectController y tareaController
const proyectosController = require('../controllers/proyectoController');
const tareasController = require('../controllers/tareaController');
const usuariosController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');



const passport = require('../config/passport'); // Importa la configuración de Passport


module.exports = function() 
{  
    
    // TODO: ruta para el home 
    router.get('/', (req, res) => {
        // authController.usuarioAutenticado,
        proyectosController.proyectosHome
    });

    // router.get("/", proyectosController.proyectoHome);
    // TODO: Pagina de inicio 
    router.get("/nosotros", 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    
    
    // TODO: Direccionar para crear nuevo proyecto 
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    
    // TODO: Registrar nuevo proyecto 
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    ); 

    // TODO: Listar proyecto por url  
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    
    // TODO: Recuperar proyecto para actualizar
    router.get('/proyectos/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    
    // TODO: Actualizar proyecto 
    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    ); 

    // TODO: Eliminar proyecto 
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    ); 
    
    // TODO: Agregar tarea 
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    ); 
    
    // TODO: Actualizar tarea 
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );
    
    // TODO: Eliminar tarea 
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );
    
    // TODO: Pagina crear nueva cuenta usuario
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    
    // TODO: Registrar nueva cuenta usuario
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    
    // TODO: Confirmar nueva cuenta usuario
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    
    // TODO: Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    
    // TODO: Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);
    
    // TODO: Reestablecer
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    
    router.get('/reestablecer/:token', authController.validarToken);

    router.post('/reestablecer/:token', authController.actualizarPassword);
    
    return router;
};
