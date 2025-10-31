<?php

namespace Controllers;

use Model\Servicio;
use MVC\Router;

// Controlador para gestionar los servicios
class ServicioController {

    // Muestra todos los servicios
    public static function index(Router $router) {
        // Iniciar sesión y verificar si el usuario es administrador
        session_start();
        isAdmin();

        // Obtener todos los servicios
        $servicios = Servicio::all();
        
        // Renderizar la vista de servicios con el nombre del usuario y la lista de servicios
        $router->render('servicios/index', [
            'nombre' => $_SESSION['nombre'],
            'servicios' => $servicios
        ]);
    }


    // Crea un nuevo servicio
    public static function crear(Router $router) {
        // Iniciar sesión y verificar si el usuario es administrador
        session_start();
        isAdmin();

        // Crear una nueva instancia de Servicio
        $servicio = new Servicio();

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Sincronizar los datos del formulario con la instancia de Servicio
            $servicio->sincronizar($_POST);

            $alertas = $servicio->validar();

            // Si no hay alertas, guardar el nuevo servicio en la base de datos
            if(empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('servicios/crear', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }
    

    // Actualiza un servicio existente
    public static function actualizar(Router $router) {
        // Iniciar sesión y verificar si el usuario es administrador
        session_start();
        isAdmin();

        // Validar el ID del servicio / Obtener el id por medio de GET
        if(!is_numeric($_GET['id'])) return;
        $servicio = Servicio::find($_GET['id']);
        
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Sincronizar los datos del formulario con la instancia de Servicio
            $servicio->sincronizar();

            // Si no hay alertas, guardar los cambios en la base de datos
            $alertas = $servicio->validar();
            if(empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('servicios/actualizar', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }


    // Elimina un servicio
    public static function eliminar() {
        // Iniciar sesión y verificar si el usuario es administrador
        session_start();
        isAdmin();

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            // Buscar el servicio por su ID
            $servicio = Servicio::find($id);

            $servicio->eliminar();
            header('Location: /servicios');
        }
    }
}