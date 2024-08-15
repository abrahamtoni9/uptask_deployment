const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//TODO: Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// TODO: Local Strategy - Login con credenciales propios (usuario y password)
passport.use( 
  new LocalStrategy(
    { 
      usernameField: 'email',
      passwordField: 'password' 
    }, 
    async(email, password, done) => 
    {  
      try 
      {
        const usuario = await Usuarios.findOne({ 
          where: 
          {
            email,
            activo : 1
          } 
        })   //Busca el usuario en base de datos por correo 
        
        // const valor = usuario.verificarPassword(password);
        if (!usuario.verificarPassword(password)) 
        {
          // console.log("InCorrecto");
          return done(null, false, { message: 'Credenciales inválidas' });
        }
        console.log("Inicio de sesion exitoso");
        return done(null, usuario);// el email existe y el password correcto
      }catch(error) 
      { 
        return done(null, false, {message: "Esa cuenta no existe"});
      }
    }
  )
);

// TODO: Serializar el password 
passport.serializeUser((usuario, callback)=>{
  callback(null, usuario);
})

// TODO: Deserializar el password 
passport.deserializeUser((usuario, callback)=>{
  callback(null, usuario);
})

// TODO: Exportamos 
module.exports = passport;