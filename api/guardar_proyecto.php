<?php
// ACTIVAR ERRORES PARA DEPURACIÓN
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);
$id_proyecto = isset($datos['id_proyecto']) ? $datos['id_proyecto'] : '';

// ... (El código para INSERTAR o ACTUALIZAR el proyecto principal va aquí, no cambia)
// Por brevedad, se omite, pero debe ser el que ya tienes. Asumimos que $id_proyecto se obtiene correctamente.
if (empty($id_proyecto)) {
    // Lógica INSERT
    // ...
    // Al final, obtienes el ID:
    $id_proyecto = $conexion->insert_id;
} else {
    // Lógica UPDATE
    // ...
    // Y la lógica de BORRAR detalles viejos
    $conexion->query("DELETE FROM inversiones WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM materias_primas WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_administrativos WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_ventas WHERE fk_id_proyecto = $id_proyecto");
}


// --- GUARDAR DETALLES (TODOS LOS BLOQUES) ---
if (!empty($datos['inversiones'])) {
    $sql_inversion = "INSERT INTO inversiones (fk_id_proyecto, nombre_activo, monto, vida_util_anios, metodo_depreciacion) VALUES (?, ?, ?, ?, ?)";
    $stmt_inversion = $conexion->prepare($sql_inversion);
    foreach ($datos['inversiones'] as $inversion) {
        $stmt_inversion->bind_param("isdis", $id_proyecto, $inversion['nombre'], $inversion['monto'], $inversion['vida_util'], $inversion['tipo']);
        $stmt_inversion->execute();
    }
    $stmt_inversion->close();
}

// === BLOQUE FALTANTE AÑADIDO ===
if (!empty($datos['materias_primas'])) {
    $sql_mp = "INSERT INTO materias_primas (fk_id_proyecto, nombre_mp, cantidad_por_unidad_prod, unidad_medida, costo_unitario) VALUES (?, ?, ?, ?, ?)";
    $stmt_mp = $conexion->prepare($sql_mp);
    foreach ($datos['materias_primas'] as $mp) {
        $stmt_mp->bind_param("isdsd", $id_proyecto, $mp['nombre'], $mp['cantidad'], $mp['unidad'], $mp['costo_unitario']);
        $stmt_mp->execute();
    }
    $stmt_mp->close();
}

// === BLOQUE FALTANTE AÑADIDO ===
if (!empty($datos['gastos_admin'])) {
    $sql_ga = "INSERT INTO gastos_administrativos (fk_id_proyecto, concepto, monto_mensual) VALUES (?, ?, ?)";
    $stmt_ga = $conexion->prepare($sql_ga);
    foreach ($datos['gastos_admin'] as $gasto) {
        $stmt_ga->bind_param("isd", $id_proyecto, $gasto['concepto'], $gasto['monto_mensual']);
        $stmt_ga->execute();
    }
    $stmt_ga->close();
}

// === BLOQUE FALTANTE AÑADIDO ===
if (!empty($datos['gastos_ventas'])) {
    $sql_gv = "INSERT INTO gastos_ventas (fk_id_proyecto, concepto, porcentaje_sobre_ventas) VALUES (?, ?, ?)";
    $stmt_gv = $conexion->prepare($sql_gv);
    foreach ($datos['gastos_ventas'] as $gasto) {
        $stmt_gv->bind_param("isd", $id_proyecto, $gasto['concepto'], $gasto['porcentaje_sobre_ventas']);
        $stmt_gv->execute();
    }
    $stmt_gv->close();
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'Proyecto guardado correctamente.']);
$conexion->close();
?>