// alert('proyectos');
import Swal from 'sweetalert2';
import axios from 'axios';
const btnEliminar = document.querySelector('#eliminar-proyecto');
if(btnEliminar)
{
    btnEliminar.addEventListener('click', ( e ) => 
    { 
        // console.log('Diste clic en eliminar');
        const urlProyecto = e.target.dataset.proyectoUrl;//caputra el valor de la propiedad data-proyecto -url del boton que se le dio click
        // console.log('urlProyecto = ',urlProyecto);
        // return;
        // TODO: remplaza los espacios en blanco por %20 para que tome como una url en el navegador
        // const urlProyecto2 = urlProyecto.replace(/ /g, '%20');

        Swal.fire({
            title: "Desea borrar el proyecto?",
            text: "Un proyecto eliminado no se puede recuperar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, borrar!",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
        if (result.isConfirmed) 
        {
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            console.log('urlProyecto = ',url);
            // console.log('urlProyecto = ',urlProyecto);
            // return;
            axios.delete(url, {params: {urlProyecto}} )
            .then( respuesta => {
                console.log(respuesta);
                Swal.fire({
                    title: "Proyecto eliminado!",
                    text:  respuesta.data, 
                    icon: "success"
                });
                    // redireccionamos 
                // setTimeout(()=>{
                //     window.location.href='/nosotros'
                // }, 3000)
            })
            .catch(error => {
                console.log("Error al intentar", error);
                Swal.fire(
                    {
                        type: error,
                        icon: "error",
                        // tittle: 'Hubo un error',
                        text: 'Hubo un error, no se puedo eliminar el proyecto'
                    }
                )
            });
            // return;   
        }
        });
    })
}

export default btnEliminar;







// document.addEventListener('DOMContentLoaded', function() {
//     const btnEliminar = document.getElementById('btnEliminar');
//     btnEliminar.addEventListener('click', function() {
//         console.log('Botón Eliminar clickeado');
//     });
// });