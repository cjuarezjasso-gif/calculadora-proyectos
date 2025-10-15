<?php
$servidor = "localhost";
$usuario = "root";
$contrasena = ""; // O la contraseña que uses
$base_de_datos = "analisis_financiero_db";
$puerto = 3307;

// Crear la conexión
$conexion = new mysqli($servidor, $usuario, $contrasena, $base_de_datos, $puerto);

// Verificar la conexión
if ($conexion->connect_error) {
  die("La conexión falló: " . $conexion->connect_error);
}

// YA NO HAY NINGÚN "ECHO" AQUÍ
?>