<?php

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController {
    public static function index( Router $router ) {
        // Iniciar sesión y verificar si el usuario es administrador
        session_start();
        isAdmin();

        // Validar la fecha - ej: 2023-10-31
        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        // Separa la fecha en año, mes y día - ej: [2023, 10, 31]
        $fechas = explode('-', $fecha);

        // Verifica que la fecha sea válida
        if( !checkdate( $fechas[1], $fechas[2], $fechas[0] ) ) {
            header('Location: /404');
        }

        // Consultar la Base de Datos para obtener las citas del día
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasServicios ";
        $consulta .= " ON citasServicios.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasServicios.servicioId ";
        $consulta .= " WHERE fecha =  '$fecha' ";

        $citas = AdminCita::SQL($consulta);

        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}