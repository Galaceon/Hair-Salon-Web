<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    // Retorna todos los servicios a la API en JSON para el JS
    public static function index() {
       $servicios = Servicio::all();
       echo json_encode($servicios);
    }

    // Almacena una cita y los servicios en la BD desde la API
    public static function guardar() {
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
}