<?php
// 🔥 1. Pedimos el gafete virtual
session_start();
require_once 'conexion.php';

// Si alguien intenta entrar sin iniciar sesión, le devolvemos una lista vacía
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([]);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];

// 🔥 2. Filtramos: Trae los proyectos SOLO si el fk_id_usuario es el mío
$sql = "SELECT * FROM proyectos WHERE fk_id_usuario = :id_user ORDER BY id_proyecto DESC";
$stmt = oci_parse($conexion, $sql);

// Le pegamos el ID del usuario a la consulta
oci_bind_by_name($stmt, ':id_user', $id_usuario);

oci_execute($stmt);

$proyectos = [];
while ($row = oci_fetch_assoc($stmt)) {
    $proyectos[] = array_change_key_case($row, CASE_LOWER);
}

oci_free_statement($stmt);
oci_close($conexion);

echo json_encode($proyectos);
?>