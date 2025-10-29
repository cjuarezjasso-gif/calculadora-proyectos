<?php
$servidor = "127.0.0.1"; // <-- CAMBIO
$usuario = "root";
$contrasena = "admin1234"; // <-- CAMBIO (pon la misma que en docker-compose.yml)
$base_de_datos = "analisis_financiero_db";
$puerto = 3307; // <-- Esto se queda igual

// Crear la conexión
$conexion = new mysqli($servidor, $usuario, $contrasena, $base_de_datos, $puerto);

// Verificar la conexión
if ($conexion->connect_error) {
  die("La conexión falló: " . $conexion->connect_error);
}
?>