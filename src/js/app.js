let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

// Objeto con info de cita
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

// Funciones
function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la seccion cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha() // Añade la fecha de la cita en el objeto
    seleccionarHora() //Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita
}

// Muestra la sección que corresponde al paso
function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Estilo al seleccionar la sección con el paso
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add("mostrar");

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

// Cambia la sección cuando se presionen los tabs
function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        })
    })
}

// Muestra u oculta los botones del paginador
function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

// Muestra la sección anterior
function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        if(paso <= pasoInicial) return;
        paso--;

        botonesPaginador();
    })
}

// Muestra la siguiente sección
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        if(paso >= pasoFinal) return;
        paso++;

        botonesPaginador();
    })
}

// Consulta la API de PHP
async function consultarAPI() {
    // Fetch a la URL
    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        // console.log(servicios);
        mostrarServicios(servicios);
        
    } catch(error) {
        console.log(error);
    }
}

// Muestra los servicios en el HTML
function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        // Destructuring de servicio
        const {id, nombre, precio} = servicio;

        // Nombre del servicio
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        // Precio del servicio
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        // Contenedor del servicio
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        // Inyectar nombre y precio al div de servicio
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        // Inyectar servicio al HTML
        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

// Selecciona o deselecciona un servicio para la cita
function seleccionarServicio(servicio) {
    // id del servicio seleccionado
    const { id } = servicio;
    // Objeto con info cita
    const { servicios } = cita;

    // Div del servicio seleccionado
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado o quitarlo
    if( servicios.some( agregado => agregado.id === id ) ) {
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

// Extraer nombre para el objeto cita
function nombreCliente() {
    const nombre = document.querySelector('#nombre').value;

    cita.nombre = nombre;
}

// Almacena la fecha en el objeto de cita
function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        // Obtener el día de la semana (0-6) domingo a sábado
        const dia = new Date(e.target.value).getUTCDay();

        // 0 es domingo y 6 es sábado, no se permite
        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de Semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

// Almacena la hora en el objeto de cita
function seleccionarHora() {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', function(e) {
        // Obtener hora en formato 24hrs
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];

        // Hora válida entre 10 y 18
        if(hora < 10 || hora > 18) {
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else {
            // Asignar hora al objeto de cita
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Crear alerta en DOM
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    // Imprimir alerta en DOM
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar alerta en 3.5s
        setTimeout(() => {
            alerta.remove();
        }, 4500);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Hacen falta Datos o Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
}