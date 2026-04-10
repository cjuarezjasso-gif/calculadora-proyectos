<?php
require_once 'conexion.php';

// Obtenemos el ID de forma segura
$id_proyecto = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$proyecto = [];

// 1. Obtener datos del proyecto principal
$sql_proyecto = "SELECT * FROM proyectos WHERE id_proyecto = :id";
$stmt = oci_parse($conexion, $sql_proyecto);
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);

$row_proyecto = oci_fetch_assoc($stmt);
if ($row_proyecto) {
    // MAGIA: Convertimos a minúsculas para que JS lo entienda
    $proyecto = array_change_key_case($row_proyecto, CASE_LOWER);
} else {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(['error' => 'Proyecto no encontrado']);
    exit();
}
oci_free_statement($stmt);

// 2. Obtener listas de detalles (Convertidas a minúsculas)

// Inversiones
$stmt = oci_parse($conexion, "SELECT * FROM inversiones WHERE fk_id_proyecto = :id");
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);
$proyecto['inversiones'] = [];
while ($row = oci_fetch_assoc($stmt)) { 
    $proyecto['inversiones'][] = array_change_key_case($row, CASE_LOWER); 
}
oci_free_statement($stmt);

// Materias Primas
$stmt = oci_parse($conexion, "SELECT * FROM materias_primas WHERE fk_id_proyecto = :id");
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);
$proyecto['materias_primas'] = [];
while ($row = oci_fetch_assoc($stmt)) { 
    $proyecto['materias_primas'][] = array_change_key_case($row, CASE_LOWER); 
}
oci_free_statement($stmt);

// Gastos Administrativos
$stmt = oci_parse($conexion, "SELECT * FROM gastos_administrativos WHERE fk_id_proyecto = :id");
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);
$proyecto['gastos_admin'] = [];
while ($row = oci_fetch_assoc($stmt)) { 
    $proyecto['gastos_admin'][] = array_change_key_case($row, CASE_LOWER); 
}
oci_free_statement($stmt);

// Gastos de Ventas
$stmt = oci_parse($conexion, "SELECT * FROM gastos_ventas WHERE fk_id_proyecto = :id");
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);
$proyecto['gastos_ventas'] = [];
while ($row = oci_fetch_assoc($stmt)) { 
    $proyecto['gastos_ventas'][] = array_change_key_case($row, CASE_LOWER); 
}
oci_free_statement($stmt);

// Gastos Indirectos Fijos
$stmt = oci_parse($conexion, "SELECT * FROM gastos_indirectos_fijos WHERE fk_id_proyecto = :id");
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);
$proyecto['gastos_fijos'] = [];
while ($row = oci_fetch_assoc($stmt)) { 
    $proyecto['gastos_fijos'][] = array_change_key_case($row, CASE_LOWER); 
}
oci_free_statement($stmt);

// Gastos Indirectos Variables
$stmt = oci_parse($conexion, "SELECT * FROM gastos_indirectos_variables WHERE fk_id_proyecto = :id");
oci_bind_by_name($stmt, ':id', $id_proyecto);
oci_execute($stmt);
$proyecto['gastos_variables'] = [];
while ($row = oci_fetch_assoc($stmt)) { 
    $proyecto['gastos_variables'][] = array_change_key_case($row, CASE_LOWER); 
}
oci_free_statement($stmt);

// 3. Enviar todo el paquete como JSON
header('Content-Type: application/json');
echo json_encode($proyecto);

oci_close($conexion);
?>