document.addEventListener('DOMContentLoaded', function() {
    iniciarApp()
})

function iniciarApp() {
    buscarPorFecha();
}

// Función para buscar citas por fecha
function buscarPorFecha() {
    const fechaInput = document.querySelector('#fecha');
    
    fechaInput.addEventListener('input', function(e) {
        const fechaSeleccionada = e.target.value;

        // Redirigir a la URL con el parámetro de fecha, URL cambia para que GET lo pueda capturar
        window.location = `?fecha=${fechaSeleccionada}`;
    })
}