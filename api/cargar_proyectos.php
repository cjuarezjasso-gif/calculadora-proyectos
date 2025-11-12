<?php
require_once 'conexion.php';

$sql = "SELECT id_proyecto, nombre_proyecto FROM proyectos ORDER BY fecha_creacion DESC";
$resultado = $conexion->query($sql);

$proyectos = [];
if ($resultado->num_rows > 0) {
  while($fila = $resultado->fetch_assoc()) {
    $proyectos[] = $fila;
  }
}

header('Content-Type: application/json');
echo json_encode($proyectos);

$conexion->close();
?>