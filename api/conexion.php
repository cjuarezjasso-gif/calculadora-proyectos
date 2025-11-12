<?php
// === CÓDIGO NUEVO (CONEXIÓN CONTENEDOR A CONTENEDOR) ===

$servidor = "db";       // <-- CAMBIO: Ya no es "127.0.0.1". Es el nombre del servicio de la BD.
$usuario = "root";
$contrasena = "admin1234"; // <-- La contraseña de tu docker-compose
$base_de_datos = "analisis_financiero_db";
$puerto = "3306";       // <-- CAMBIO: Usamos el puerto INTERNO de MySQL, no el 3307.

// Crear la conexión
$conexion = new mysqli($servidor, $usuario, $contrasena, $base_de_datos, $puerto);

// Verificar la conexión
if ($conexion->connect_error) {
  die("La conexión falló: " . $conexion->connect_error);
}
?>