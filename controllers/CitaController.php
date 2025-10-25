<?php

namespace Controllers;

use MVC\Router;

class CitaController {
    public static function index(Router $router) {

        session_start(); // Moved to Router.php to avoid multiple calls

        isAuth();


        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}