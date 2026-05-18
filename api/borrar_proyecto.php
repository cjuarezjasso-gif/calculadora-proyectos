<?php
require_once 'conexion.php';

// Recibimos los datos (JavaScript normalmente manda un JSON al borrar)
$datos = json_decode(file_get_contents('php://input'), true);

// Obtenemos el ID, ya sea por JSON, POST o GET
// Buscamos el ID con todos los nombres posibles que podría estar usando tu JavaScript
$id_proyecto = $datos['id_proyecto'] ?? $datos['id'] ?? $_POST['id_proyecto'] ?? $_POST['id'] ?? $_GET['id_proyecto'] ?? $_GET['id'] ?? null;

if (empty($id_proyecto)) {
    echo json_encode(['status' => 'error', 'message' => 'No se recibió el ID del proyecto a borrar.']);
    exit;
}

// Preparamos la instrucción en el idioma de Oracle
$sql = "DELETE FROM proyectos WHERE id_proyecto = :id_proyecto";
$stmt = oci_parse($conexion, $sql);

// Amarramos la variable
oci_bind_by_name($stmt, ':id_proyecto', $id_proyecto);

// Ejecutamos el borrado (El ON DELETE CASCADE de la BD borrará los detalles automáticamente)
if (oci_execute($stmt)) {
    echo json_encode(['status' => 'success', 'message' => 'Proyecto eliminado correctamente.']);
} else {
    $e = oci_error($stmt);
    echo json_encode(['status' => 'error', 'message' => 'Error al borrar: ' . $e['message']]);
}

// Cerramos la conexión
oci_free_statement($stmt);
oci_close($conexion);
?>