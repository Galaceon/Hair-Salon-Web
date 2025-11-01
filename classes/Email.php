<?php

// Clase para el manejo de envíos de correos electrónicos

namespace Classes;

// Importar PHPMailer para el envío de correos
use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token) {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion() {
        
        // Crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Confirma tu cuenta';

        // Set HTML
        // Cuerpo del mail con el token de reestablecimiento en la URL
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola, " . $this->email . " has creado tu cuenta en AppSalon, solo debes confirmarla en el siguiente enlace.</strong></p>";
        $contenido .= "<p>Presiona aquí: <a href='" . $_ENV['APP_URL'] . "/confirmar-cuenta?token=" . $this->token ."'>Confirmar Cuenta</a></p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje.</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        // Enviar el Mail
        $mail->send();
    }

    public function enviarInstrucciones() {
        // Crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        $mail->Subject = 'Reestablece tu password';

        // Set HTML
        // Cuerpo del mail con el token de reestablecimiento en la URL
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola, " . $this->nombre . " has solicitado reestablecer tu password, sigue el siguiente enlace para hacerlo.</strong></p>";
        $contenido .= "<p>Presiona aquí: <a href='" . $_ENV['APP_URL'] . "/recuperar?token=" . $this->token ."'>Reestablecer Password</a></p>";
        $contenido .= "<p>Si tu no solicitaste este cambio, puedes ignorar el mensaje.</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        // Enviar el Mail
        $mail->send();
    }
}