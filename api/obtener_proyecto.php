<?php
require_once 'conexion.php';

$id_proyecto = $_GET['id'];
$proyecto = [];

// 1. Obtener datos del proyecto principal
$sql_proyecto = "SELECT * FROM proyectos WHERE id_proyecto = ?";
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

// 2. Obtener listas de detalles

// Inversiones
$resultado = $conexion->query("SELECT * FROM inversiones WHERE fk_id_proyecto = $id_proyecto");
$proyecto['inversiones'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Materias Primas
$resultado = $conexion->query("SELECT * FROM materias_primas WHERE fk_id_proyecto = $id_proyecto");
$proyecto['materias_primas'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Gastos Administrativos
$resultado = $conexion->query("SELECT * FROM gastos_administrativos WHERE fk_id_proyecto = $id_proyecto");
$proyecto['gastos_admin'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Gastos de Ventas
$resultado = $conexion->query("SELECT * FROM gastos_ventas WHERE fk_id_proyecto = $id_proyecto");
$proyecto['gastos_ventas'] = $resultado->fetch_all(MYSQLI_ASSOC);

// --- AQUÍ ESTABA EL FALTANTE: GASTOS INDIRECTOS ---

// Gastos Indirectos Fijos
$resultado = $conexion->query("SELECT * FROM gastos_indirectos_fijos WHERE fk_id_proyecto = $id_proyecto");
$proyecto['gastos_fijos'] = $resultado->fetch_all(MYSQLI_ASSOC);

// Gastos Indirectos Variables
$resultado = $conexion->query("SELECT * FROM gastos_indirectos_variables WHERE fk_id_proyecto = $id_proyecto");
$proyecto['gastos_variables'] = $resultado->fetch_all(MYSQLI_ASSOC);

// --------------------------------------------------

// 3. Enviar todo el paquete como JSON
header('Content-Type: application/json');
echo json_encode($proyecto);

$conexion->close();
?>