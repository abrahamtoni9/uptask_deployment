
const path = require('path');
const webpack = require('webpack'); 

module.exports = 
{
    entry : './public/js/app.js', // punto de entrada  del proyecto, donde se encuentra el archivo principal que queremos empaquetar
    output : 
    {
        filename : 'bundle.js', // archivo de salida  del bundle generado por Webpack directorio donde se va a colocar el bundle generado en desarrollo en producción 
        path : path.join(__dirname, './public/dist')// donde se va guardar  el bundle final de nuestra aplicación
    },
    module : //indicamos el modulo  de los archivos que vamos a utilizar en nuestro proyecto,  es decir le decimos al compilador como se llaman y donde estan estos módulos 
    {
        rules : // regla para que se puedan usar los módulos de node_modules directamente en el código 
        [
            {
                test : /\.m?js$/, // nos indica que archivos van a procesar con extensión .js o .mjs los vamos a tratar con Babel 
                use : //inicamos que queremos utilizar este módulo, en este caso un loader de TypeScript 
                {
                    loader : 'babel-loader',
                    options : // opciones  del Babel Loader
                    {
                        presets : // indica  a Babel que version de JavaScript estamos usando (ES6)
                        [
                            '@babel/preset-env' // indica  a Babel que utilice las últimas características de ECMAScript
                        ]
                    }
                }
            }
        ]
    }
}