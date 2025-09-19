<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Reestablece tu password escribiendo tu email a continuación</p>

<form class="formulario" action="/olvide" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Tu email" name="email">
    </div>

    <input type="submit" class="boton" value="Enviar al Email">
</form>

<div class="acciones">
    <a href='/'>Iniciar Sesión</a>
    <a href='/crear-cuenta'>Crear una cuenta</a>
</div>