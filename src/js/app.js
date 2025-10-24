let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

// Objeto con info de cita
const cita = {
    id: '',
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

    idCliente();
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

    // Estilo al seleccionasession_startr la sección con el paso
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

    
    if(paso === 1) { // Si estamos en el paso 1 mostrar solo siguiente
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3) { // Si estamos en el paso 3 mostrar solo anterior
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else { // Si estamos en el paso 2 mostrar ambos
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


function idCliente() {
    const id = document.querySelector('#id').value;

    cita.id = id;
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

        console.log(cita);

        return;
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;


    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;

        // Por cada servicio crear un div
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        // Inyectar texto y precio al contenedor
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        // Inyectar contenedor con nombre y precio al resumen
        resumen.appendChild(contenedorServicio);
    })

    // Heading para Cliente en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen del Cliente';
    resumen.appendChild(headingCita);

    // Datos del cliente
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en Español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    // Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;
    
    // Inyectar al resumen HTML
    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}


async function reservarCita() {
    const { nombre, fecha, hora, servicios, id } = cita

    const idServicios = servicios.map( servicio => servicio.id);

    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);

    // console.log([...datos]);

    try {
        // Petición hacia la API
        const url = 'http://localhost:3000/api/citas';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        if(resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK',
                theme: 'dark'
            }).then( () => {
                window.location.reload();
            })
        }
    } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error creando tu cita",
          text: "Tu cita no fue creada, intentalo de nuevo",
          theme: 'dark'
        });
    }
}