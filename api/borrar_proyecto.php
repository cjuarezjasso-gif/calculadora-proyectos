<?php
require_once 'conexion.php';

// Recibir el ID a borrar (puede venir por GET o POST)
$id_proyecto = $_GET['id'] ?? $_POST['id'] ?? null;

if ($id_proyecto) {
    // La base de datos ya está configurada para borrar en cascada (ON DELETE CASCADE)
    // Así que al borrar el proyecto, se borran sus inversiones, gastos, etc. solos.
    $sql = "DELETE FROM proyectos WHERE id_proyecto = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_proyecto);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Proyecto eliminado']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo eliminar']);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Falta el ID']);
}
$conexion->close();
?>