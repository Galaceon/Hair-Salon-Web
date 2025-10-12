let paso = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});


function iniciarApp() {
    mostrarSeccion() // Muestra y oculta las secciones
    tabs(); // Cambia la seccion cuando se presionen los tabs
}

function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso
    const seccion = document.querySelector(`#paso${paso}`)
    seccion.classList.add("mostrar")

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual')
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button')

    botones.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();
        })
    })
}