<?php
require_once 'conexion.php';

// Preparamos la consulta para Oracle
$sql = "SELECT * FROM proyectos";
$stmt = oci_parse($conexion, $sql);

// Ejecutamos la consulta
oci_execute($stmt);

$proyectos = [];
// Sacamos los datos fila por fila
while ($row = oci_fetch_assoc($stmt)) {
    $proyectos[] = array_change_key_case($row, CASE_LOWER);
}

// Liberamos memoria y cerramos
oci_free_statement($stmt);
oci_close($conexion);

// Devolvemos los datos limpios en JSON a tu JavaScript
echo json_encode($proyectos);
?>