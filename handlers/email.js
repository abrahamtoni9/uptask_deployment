const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const util = require('util');
const emailconfig = require('../config/email');

const { htmlToText } = require('html-to-text');
const transporter = nodemailer.createTransport({
    host: emailconfig.host,
    port: emailconfig.port,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: emailconfig.user,
        pass: emailconfig.pass,
    },
});


const generarHTML = ( archivo, opciones = {} ) => 
{
  // Renderiza el archivo Pug a HTML
  const html = pug.renderFile(`${__dirname}/../views/email/${archivo}.pug`, opciones); 
  const inlineHtml = juice(html);
  // console.log(inlineHtml); // Verificar el HTML generado
  // Inyecta los estilos CSS en línea y retorna el HTML final
  return juice(html);
}

exports.main = async function( opciones ) 
{
  const html = generarHTML(opciones.archivo, opciones);
  const text = htmlToText(html);
  let opcionesEmail = 
  {
    from: 'UpTask  <no-reply@example.com>', // sender address
    to: opciones.usuario, // list of receivers
    subject: opciones.subject, // Subject line
    text, // plain text body
    html// html body
  };  
  const enviarEmail = util.promisify(transporter.sendMail.bind(transporter));
  return enviarEmail(opcionesEmail);
}



