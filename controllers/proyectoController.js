const Proyectos = require('../models/Proyectos'); 

const Tareas = require('../models/Tareas'); 

const slug = require('slug'); 

// exports -> se usa para exportar varios modulos 
// module.exports -> se usa para exportar un solo modulo

exports.proyectosHome = async (req, res) => 
{
    // console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});//findAll() equivale a ejecutar  la sentencia select * from proyectos where usuarioId = valor_usuarioId 
    // console.log(proyectos);
    // res.send('nosotros');

    res.render('nosotros',
    {
        nombrePagina : 'Proyectos ' + res.locals.year,
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => 
{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});//findAll() equivale a ejecutar  la sentencia select * from proyectos where usuarioId = valor_usuarioId 
    res.render('nuevoProyecto',
    {
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => 
{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});//findAll() equivale a ejecutar  la sentencia select * from proyectos where usuarioId = valor_usuarioId 
    // res.send('Enviaste el formulario');
    // console.log(req.body);
    // TODO: validar algo que tengamos en el input 
    const { nombre } = req.body;
    let errores = [];
    // console.log(nombre);
    if(!nombre)
    {
        // console.log('1 - Hola');
        errores.push({'texto' : 'Agregar un nombre al proyecto'});
    }
    if(errores.length > 0)
    {
        // console.log('2 - Hola');
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto', 
            errores,
            proyectos
        })
    }
    else
    {
        // console.log(slug(nombre));
        // const url = slug(nombre).toLocaleLowerCase();
        const usuarioId = res.locals.usuario.id;

        const proyecto = await Proyectos.create({ nombre, usuarioId });
        res.redirect('/nosotros');
    }
}


// TODO: Agrupamos todas las consultas en un async  y retornamos la promesa   
exports.proyectoPorUrl = async ( req, res, next ) =>
{
    const usuarioId = res.locals.usuario.id;
    //TODO: recuperamos todos los registros de la tabla proyectos por el usuarioId
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});//findAll() equivale a ejecutar  la sentencia select * from proyectos where usuarioId = valor_usuarioId 
    // res.send('Enviaste el formulario');
    // res.send(req.params.url);

    //TODO: filtramos el registro de bd por el parametro "url" que viene de la url
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // TODO: Consultar tareas del Proyecto actual 
    // console.log(proyecto);
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        },
        // include: 
        // [
        //     { model: Proyectos},
        // ]
    });
    // console.log(tareas);
    if(!proyecto) return next();
    // console.log("proyecto = " + proyecto);
    // res.send("Ok");

    // TODO: Renderizamos  la vista con el modelo de datos completo
    res.render('tareas',{
        nombrePagina:'Tareas del Proyecto',
        proyecto,    
        proyectos,
        tareas
    })
}

// TODO: Agrupamos todas las consultas en un async  y retornamos la promesa 
exports.formularioEditar = async ( req, res ) =>
{
    const usuarioId = res.locals.usuario.id;
    //TODO: recuperamos todos los registros de la tabla proyectos por el usuarioId
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});//findAll() equivale a ejecutar  la sentencia select * from proyectos where usuarioId = valor_usuarioId 
    //filtramos el registro de bd por el parametro "url" que viene de la url
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}


exports.actualizarProyecto = async(req, res) => 
{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});//findAll() equivale a ejecutar  la sentencia select * from proyectos where usuarioId = valor_usuarioId 
    // res.send('Enviaste el formulario');
    // res.send('Enviaste el formulario');
    // console.log(req.body);
    // validar algo que tengamos en el input 
    const { nombre } = req.body;
    let errores = [];
    // console.log(nombre);
    if(!nombre)
    {
        // console.log('1 - Hola');
        errores.push({'texto' : 'Agregar un nombre al proyecto'});
    }
    // console.log(errores);
    if(errores.length > 0)
    {
        // console.log('2 - Hola');
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto', 
            errores,
            proyectos
        })
    }
    else
    {
        // console.log('3 - Hola');
        console.log(slug(nombre));
        // const url = slug(nombre).toLocaleLowerCase();
        await Proyectos.update(
            { nombre: nombre },
            { where : { id: req.params.id }
        });
        res.redirect('/nosotros');
    }
}


exports.eliminarProyecto = async(req, res, next) => 
{
    // TODO: se puede usar req.query o reqparams 
    // console.log("params = ",req.params);
    // console.log("query = ",req.query);
    // console.log(req);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where:{url: urlProyecto}});
    if (!resultado) 
    {
        // TODO: next() indica que va a cortar  el flujo y pasarlo a la siguiente función de middleware
        return next();    
    }
    res.status(200).send('Proyecto eliminado correctamente');
}


 