<?php
require_once 'conexion.php';

$id_proyecto = $_GET['id'];
$proyecto = [];

// 1. Obtener datos del proyecto principal
$sql_proyecto = "SELECT * FROM Proyectos WHERE id_proyecto = ?";
$stmt = $conexion->prepare($sql_proyecto);
$stmt->bind_param("i", $id_proyecto);
$stmt->execute();
$resultado = $stmt->get_result();
if ($resultado->num_rows > 0) {
    $proyecto = $resultado->fetch_assoc();
} else {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(['error' => 'Proyecto no encontrado']);
    exit();
}
$stmt->close();

// 2. Obtener listas de detalles y añadirlas al objeto del proyecto

// Inversiones
$resultado = $conexion->query("SELECT * FROM Inversiones WHERE fk_id_proyecto = $id_proyecto");
$proyecto['inversiones'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Materias Primas
$resultado = $conexion->query("SELECT * FROM Materias_Primas WHERE fk_id_proyecto = $id_proyecto");
$proyecto['materias_primas'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Gastos Administrativos
$resultado = $conexion->query("SELECT * FROM Gastos_Administrativos WHERE fk_id_proyecto = $id_proyecto");
$proyecto['gastos_admin'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Gastos de Ventas
$resultado = $conexion->query("SELECT * FROM Gastos_Ventas WHERE fk_id_proyecto = $id_proyecto");
$proyecto['gastos_ventas'] = $resultado->fetch_all(MYSQLI_ASSOC);


// 3. Enviar todo el paquete como JSON
header('Content-Type: application/json');
echo json_encode($proyecto);

$conexion->close();
?>