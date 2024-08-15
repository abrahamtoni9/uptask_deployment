import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avances";

const tareas = document.querySelector('.listado-pendientes');

if(tareas)
{
    tareas.addEventListener('click', e => {
        // console.log(e.target.classList);
        if (e.target.classList.contains('fa-check-circle')) 
        {
            // console.log('Actualizando..');
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            // console.log(idTarea);
            const url = `${location.origin}/tareas/${idTarea}`;
            // console.log(url);
            axios.patch(url, {idTarea})
            .then((data)=>{
                // location.reload();
                // console.log(data);
                if (data.status === 200) 
                {
                    icono.classList.toggle('completo');
                    actualizarAvance();
                }
            });
        }
        if (e.target.classList.contains('fa-trash')) 
        {
            // console.log('Eliminando');
            const tareaHtml = e.target.parentElement.parentElement;
            const idTarea = tareaHtml.dataset.tarea;
            // console.log(tareaHtml);
            // console.log(idTarea);
            Swal.fire({
                title: "Desea borrar el proyecto?",
                text: "Un proyecto eliminado no se puede recuperar!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, borrar!",
                cancelButtonText: "No, cancelar"
            }).then((result) => 
            {
                if (result.value) 
                {
                    // console.log('Eliminando...');
                    const url = `${location.origin}/tareas/${idTarea}`;
                    // TODOD: Enviamos una peticion a la API para eliminarla
                    axios.delete(url, {params:{idTarea}})
                    .then((respuesta) => {
                        // console.log(respuesta);
                        if (respuesta.status == 200)  
                        {
                            tareaHtml.parentElement.removeChild(tareaHtml);
                            
                            Swal.fire(
                                '¡Borrado!',
                                respuesta.data,
                                'success'
                            );

                            actualizarAvance();
                        }
                    })                  
                }
            });
        }
    } )
} 
