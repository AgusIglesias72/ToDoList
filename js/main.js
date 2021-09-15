// Tomo los ID del HTML

const formulario = document.getElementById('formulario')
const input = document.getElementById('tarea')
const validar = document.getElementById('validacion')
const boton = document.getElementById('button')
const botonLogradas = document.getElementById('buttonRealizadas')
const importancia = document.getElementById('dificultad')
const listaTareas = document.getElementById('lista-tareas')
const ordenar = document.getElementById('ordenar')
const scrollArriba = document.getElementById('button-up')


// Defino Arrays vacíos a los que le agrego las tareas
let tareas = []
let tareasLogradas = []

input.focus()


// Módulo Funciones

// Crear y Sumar Objetos
const sumarTarea = () => {
    if ((input.value.trim()).length <= 5){
        input.classList.add('is-invalid')
        input.Placeholder = "El texto es muy corto"

        input.focus()
        return
    }
    if (importancia.value == ""){
        importancia.classList.add('is-invalid')
        return
    }  
    const tarea = {
        id: Date.now(), 
        texto: input.value.toString(), 
        importancia: colorCirculo(importancia.value),
        valor: importancia.value
    } 
    formulario.reset()
    tareas.push(tarea)

    localStorage.setItem('tareas', JSON.stringify(tareas))
}
// Mostrar Tareas
const mostrarTareas = () => {
    if(tareas.length === 0){
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center">
            No hay tareas pendientes
        </div>
        `
        return
    }
    listaTareas.innerHTML = ''

    tareas.forEach((tarea) => {
        const div = document.createElement('div')
        div.className = "col-12 alert alert-warning d-flex align-items-center justify-content-between"
        div.innerHTML = `
            <p class="col-8 m-0 text-center text-wrap text-break">${tarea.texto}</p>
            <h3 class="text-start col-2 m-0">
                <i class="fas fa-circle ${tarea.importancia}"></i> 
            </h3>
            <h3 class="col-2 text-center m-0">
                <i class="mx-1 my-2 tareaLograda${tarea.id} fas fa-check-circle text-success" role="button"></i>
                <i class="mx-1 my-2 eliminar${tarea.id} fas fa-minus-circle text-danger" role="button"></i>
            </h3>
        `
        listaTareas.prepend(div)

        document.querySelector(`.tareaLograda${tarea.id}`).addEventListener('click', (e) => {
            // e.target.parentElement.parentElement.remove()
            tareaLograda(tarea.id)
        })
        document.querySelector(`.eliminar${tarea.id}`).addEventListener('click', (e) => {            
            eliminarTarea(tareas,tarea.id)
        })
    })
    input.focus({preventScroll: true})
}
// Mostrar Logradas
const mostrarTareasLogradas = () => {
    if (localStorage.getItem('tareasLogradas')){
        tareasLogradas = JSON.parse(localStorage.getItem('tareasLogradas'))
    }
    listaTareas.innerHTML = ''

    tareasLogradas.forEach((itemLogrado) => {
        const div = document.createElement('div')
        div.className = "col-12 alert alert-warning d-flex align-items-center justify-content-between"
        div.innerHTML = `
            <p class="col-8 m-0 text-wrap text-break">${itemLogrado.texto}</p>
            <h3 class="text-start col-2 m-0">
                <i class="fas fa-circle ${itemLogrado.importancia}"></i> 
            </h3>
            <h3 class="col-2 text-center m-0">
            <i class="mx-1 my-2 eliminarLog${itemLogrado.id} fas fa-minus-circle text-danger" role="button"></i>
        </h3>
        `
        listaTareas.prepend(div)

        document.querySelector(`.eliminarLog${itemLogrado.id}`).addEventListener('click', () => {            
            eliminarTareaLograda(tareasLogradas,itemLogrado.id)
        })
    })
    formulario.reset()
}
// Funcion para eliminar
const eliminarTarea = (array,id) => {
    const item = array.find(el => el.id == id)
    const num = array.indexOf(item)
    array.splice(num, 1)

    mostrarTareas()

    localStorage.setItem('tareas', JSON.stringify(tareas))
}

const eliminarTareaLograda = (array,id) =>{
    const item = array.find(el => el.id == id)
    const num = array.indexOf(item)
    array.splice(num,1)

    
    localStorage.setItem('tareasLogradas', JSON.stringify(tareasLogradas))
    mostrarTareasLogradas()

}

// Funcion para pushear al array de tareas logradas
const tareaLograda = (id) => {
    const itemLogrado = tareas.find(el => el.id == id)
    tareasLogradas.push(itemLogrado)

    eliminarTarea(tareas,id)

    localStorage.setItem('tareasLogradas', JSON.stringify(tareasLogradas))
}
// Funcion para Ordenar
const ordenarTareas = array =>{
    if (ordenar.value == "recientes"){
        array.sort((a, b) =>{
            if (a.id < b.id){
                return -1
            }
        })
    } else if (ordenar.value == "antiguos"){
        array.sort((a, b) =>{
            if (a.id > b.id){
                return -1
            }
        })
    } else if (ordenar.value == "importantes"){
        array.sort((a, b) =>{
            if (a.valor < b.valor){
                return -1
            }
        })
    } else{
        array.sort((a, b) =>{
            if (a.valor > b.valor){
                return -1
            }
        })
    }
    mostrarTareas()
    ordenar.reset()
}
// Función para asignar valor a propiedad importancia de objeto
const colorCirculo = (i) =>{
    if (i == 0){
        return 'text-success'
    } else if (i == 1){
        return 'text-warning'
    } else{
        return' text-danger'
    }
}
// Boton para scrollear arriba
window.onscroll = () =>{
    let scroll = document.documentElement.scrollTop

    if (scroll > 200){
        scrollArriba.style.transform = "scale(1)"
    } else if (scroll < 200){
        scrollArriba.style.transform = "scale(0)"
    }
}


// Módulo de Eventos
 
// Al cargar la página
document.addEventListener('DOMContentLoaded', () =>{
    if (localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    mostrarTareas()
})

scrollArriba.addEventListener('click', () =>{
    window.scrollTo(0,0)
})

// Sumar nueva tarea
formulario.addEventListener('submit', e =>{
    e.preventDefault()  
    sumarTarea()
    mostrarTareas()
    ordenar.classList.remove('visually-hidden')
    document.getElementById('labelOrdenar').classList.remove('visually-hidden')
})
// Ir a ver las Tareas Logradas
botonLogradas.addEventListener('submit', e =>{
    e.preventDefault()
    mostrarTareasLogradas()
    importancia.classList.remove('is-invalid')
    ordenar.classList.add('visually-hidden')
    document.getElementById('labelOrdenar').classList.add('visually-hidden')
})
// Pintar de Rojo - Importancia
importancia.addEventListener('change', () =>{
    importancia.classList.remove('is-invalid')
    input.focus()
})
// Pintar de Rojo - Input
input.addEventListener('keydown', () =>{
    if (input.value.trim().length > 5){
        input.classList.remove('is-invalid')
    }
})
input.addEventListener('blur', () =>{
        input.classList.remove('is-invalid')
})
// Ordenar
ordenar.addEventListener('change', () =>{
    ordenarTareas(tareas)
    input.focus({preventScroll: true})
})