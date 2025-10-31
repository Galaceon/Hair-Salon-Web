<?php

namespace Controllers;

use MVC\Router;

class CitaController {
    public static function index(Router $router) {

        session_start();

        // Si no hay sesión, redireccionar a login
        isAuth();

        // Si hay sesión, renderizar la vista
        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}