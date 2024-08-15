// TODO: importamos los modelos 
const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.agregarTarea = async (req, res, next) => 
{
    // res.send('Enviado'); // res.send(req.params.url);
    // TODO: consultamos la tabla proyecto filtrado por la columna url y como valor de filtro le pasamos el parametro de la url 
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url }})
    // console.log(proyecto); // console.log(req.body);
    // TODO: destructuramos el body para acceder a las propiedades 
    const {tarea} = req.body;
    // TODO: estado 0 es igual a incompleto
    const estado = 0;
    // TODO: capturamos el id del proyecto en una constante
    const proyectoId = proyecto.id;
    // TODO: insertamos en la tabla tarea
    const resultado = await Tareas.create({ tarea, estado, proyectoId});

    if (!resultado) 
    {
        return next();     
    }
    // TODO: redireccionamos a la misma pagina 
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res) => 
{
    // res.send('Todo bien..')
    // console.log(req.params);
    const { id } = req.params;
    const tarea = await Tareas.findOne({where:{ id }}); 
    // console.log(tarea);
    let estado = 0;
    if (tarea.estado === estado ) 
    {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado')
}  

exports.eliminarTarea = async function(req, res){
    // res.send('Eliminando');
    // console.log(req.query);//TODO: tambien podemos acceder atravez de req.query
    const { id } = req.params;

    //TODO: Elimina la tarea
    const resultado = await Tareas.destroy({ where: { id } });
    
    //TODO: Si  no se elimino correctamente retornamos el control a la siguiente intruccion el metodo next()
    if (!resultado) return next();
    
    //TODO: Cuando el  proyecto es eliminado correctamente lo mandamos a la vista del detalle del proyecto con un mensaje
    res.status(200).send('Tarea eliminada');
};





// exports.eliminarTarea = async function(req, res){
//     try  
//     {
//         const proyecto = await Proyectos.destroy({ where: { id: req.params.id } });
//         if (!proyecto)  
//             return res.status(400).send("No se ha encontrado el proyecto");
         
//         res.status(200).send("Se ha eliminado correctamente")
                      
//     }catch(err)
//     {
//         console.log(err);
//         res.status(500).send("Error interno del servidor");
//     }
// };

/*
Este metodo es una version mas sencilla de eliminar un proyecto y lo que hace es desactivarlo en lugar de borrar
exports.listarUsuariosPorId = async (req, res)=>
{
    const usuarios=await Usuarios.findAll({where:{id_usuario:req.params.id}});
    res.json(usuarios);
};*/

// module.exports={
//     listarTareas,
//     crearTarea,
//     actualizarEstadoTarea,
//     // eliminarProyecto,
//     // listarUsuariosPorId
// };

 