<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {

    // Función para enviar headers CORS
    private static function enviarHeadersCORS() {
        header("Access-Control-Allow-Origin: *"); // Cambia * por tu dominio si quieres seguridad
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        
        // Responder a preflight request (OPTIONS)
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }


    // Retorna todos los servicios a la API en JSON para el JS
    public static function index() {
        self::enviarHeadersCORS();
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    // Almacena una cita y los servicios en la BD desde la API
    public static function guardar() {
        self::enviarHeadersCORS();
        // Almacena la cita y devuelve el id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        // Obtener el ID de la cita creada
        $id = $resultado['id'];

        // ALMACENA LOS SERVICIOS CON EL ID DE LA CITA
        // Servicios de la cita guardados en un array
        $idServicios = explode(",", $_POST['servicios']);

        // Por cada servicio crear un registro en la tabla citasServicio
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        // Retornamos una respuesta hacia el JS
        echo json_encode(['resultado' => $resultado]);
    }

    // Elimina una cita y los servicios asociados desde la API
    public static function eliminar() {
        self::enviarHeadersCORS();
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }
}