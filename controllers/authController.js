const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/nosotros', 
    failureRedirect:'/iniciar-sesion',
    failureFlash: true, // Permite el uso de mensajes flash para mostrar errores de autenticación
    badRequestMessage: 'Ambos campos son obligatorio' // Mensaje personalizado en caso de que la solicitud sea incorrecta
});

// TODO: Funcion para revisar si el usuario esta logueado o no 
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) 
    {
        // console.log('Hollaa');
        return next();    
    }
    //si el usuario no esta autenticado, redirigir al formulario de login
    // console.log('1 - Hollaa');
    return res.redirect('/iniciar-sesion');
}

// TODO: Funcion para cerrar sesion 
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

// TODO: Genera el tokens si el usuario es valido 
exports.enviarToken = async (req, res) => {
    //verificar si el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where:{email}});
    if (!usuario) 
    {
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer');
    }
    // Usuario existe 
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now()+ 3600000;
    await usuario.save();//guardar
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`; 
    // console.log(resetUrl);
    // Envia el correo con el token
    await enviarEmail.main({
        usuario: usuario.email,
        subject: 'Password Reset',
        resetUrl,
        archivo : 'restablecer-password'
    }); 

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    // res.json(req.params.token);
    const usuario = await Usuarios.findOne({where:{token: req.params.token}});
    if(!usuario)
    {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');     
    }
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    })
}

// TODO: cambiar el password por uno nuevo 
exports.actualizarPassword = async (req, res) => {
    // console.log(req.params.token);
    //verifica el token valido y tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    }); 

    // console.log(usuario);
    // verificamos si el usuario existe 
    if (!usuario) 
    {
        req.flash('error', 'No valido ');
        res.redirect('/reestablecer');   
    }

    // TODO: hasheamos el nuevo password 
    usuario.password=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}
    