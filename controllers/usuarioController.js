
const Usuario = require('../models/Usuarios');

const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => 
{
    // res.send('funciona');
    res.render('crearCuenta',{
        nombrePagina : 'Crear Cuenta en Uptask'
    })
}

exports.formIniciarSesion = (req, res) => 
{
    // console.log(res.locals.mensajes);
    const { error } = res.locals.mensajes;

    res.render('iniciarSesion',{
        nombrePagina : 'Iniciar sesion en Uptask',
        error
    })
}

exports.crearCuenta = async (req, res) => 
{
    // res.send('Enviaste el form'); console.log(req.body);
    const { email, password } = req.body;

    try {
        await Usuario.create({
            email,
            password
        });
        // crear una URL de confirmar 
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        // crear el objeto usuario 
        const usuario = 
        {
            email
        }

        // enviar email 
        await enviarEmail.main({
            usuario: usuario.email,
            subject: 'Confirmar tu cuenta UpTask',
            confirmarUrl,
            archivo : 'confirmar-cuenta'
        }); 
    
        // redirigir al usuario  
        req.flash('correcto', 'Se envio un mensaje a tu correo, por favor confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) 
    {
        if (error.errors && Array.isArray(error.errors)) {
            req.flash('error', error.errors.map(err => err.message));
        } else {
            // Si no es un error de validación, manejarlo de manera genérica
            req.flash('error', 'Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.');
        }
    
        // req.flash('error', error.errors.map(err => err.message));
        res.render('crearCuenta',
        {
            mensajes : req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req, res) => 
{
    res.render('reestablecer',{
        nombrePagina : 'Reestablecer contraseña'
    })
}

// TODO:cambia el estado de una cuenta recien creada
exports.confirmarCuenta = async (req, res) => 
{
    // res.json(req.params.correo);
    const usuario = await Usuario.findOne({
        where:{
            email:req.params.correo
        }
    });

    // TODO: si no existe el usuario 
    if (!usuario) 
    {
        req.flash('error', 'No existe el usuario con ese correo');
        res.redirect('/crear-cuenta');
    };
    // console.log('Usuario encontrado:', usuario);
    usuario.activo = 1;
    usuario.save();
    // console.log('Usuario actualizado:', usuario);
    req.flash('correcto','Cuenta activada');
    res.redirect('/iniciar-sesion');
}
