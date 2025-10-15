<?php
// ACTIVAR ERRORES PARA DEPURACIÓN
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);
$id_proyecto = isset($datos['id_proyecto']) ? $datos['id_proyecto'] : '';

// Definir todos los campos para la tabla Proyectos
$campos_proyectos = [
    'nombre_proyecto', 'poblacion_total', 'pct_mujeres', 'pct_rango_edad', 'pct_poblacion_ocupada', 
    'pct_concentracion_mercado', 'participacion_mercado', 'incremento_poblacion', 'incremento_producto', 
    'penetracion_inicial', 'incremento_penetracion', 'precio_unitario_base', 'incremento_precio', 
    'unidades_venta_a1', 'unidades_venta_a2', 'unidades_venta_a3', 'unidades_venta_a4', 'unidades_venta_a5', 
    'dias_credito_ventas', 'dias_credito_compras', 'descuento_pronto_pago', 'inv_inicial_prod', 'inv_final_a1', 
    'inv_final_a2', 'inv_final_a3', 'inv_final_a4', 'inv_final_a5', 'inv_inicial_mp', 'inv_final_mp_pct', 
    'tiempo_unidad_mo', 'costo_hora_mo'
];
$valores = [];

if (empty($id_proyecto)) {
    // --- INSERT (Proyecto Nuevo) ---
    $sql = "INSERT INTO Proyectos (fk_id_usuario, " . implode(', ', $campos_proyectos) . ") VALUES (?," . str_repeat('?,', count($campos_proyectos) - 1) . "?)";
    $stmt = $conexion->prepare($sql);
    
    $fk_id_usuario = 1;
    $valores[] = &$fk_id_usuario;
    $tipos = 'i';

    foreach($campos_proyectos as $campo) {
        $valores[] = &$datos[$campo];
    }
    
    // === LÍNEA CORREGIDA === (Ahora tiene 31 letras para los 31 campos)
    $tipos .= 'sddddddddddddiiiiiiidiiiiiiiddd';

    $stmt->bind_param($tipos, ...$valores);

    if ($stmt->execute()) {
        $id_proyecto = $conexion->insert_id;
    } else {
        // Manejo de error
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta INSERT: ' . $stmt->error]);
        exit;
    }
} else {
    // --- UPDATE (Proyecto Existente) ---
    $set_sql = [];
    foreach($campos_proyectos as $campo) {
        $set_sql[] = "$campo = ?";
        $valores[] = &$datos[$campo];
    }
    $valores[] = &$id_proyecto;
    
    // === LÍNEA CORREGIDA === (31 letras para los campos + 'i' para el id_proyecto)
    $tipos = 'sddddddddddddiiiiiiidiiiiiiidddi';

    $sql = "UPDATE Proyectos SET " . implode(', ', $set_sql) . " WHERE id_proyecto = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param($tipos, ...$valores);
    $stmt->execute();
    
    $conexion->query("DELETE FROM inversiones WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM materias_primas WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_administrativos WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_ventas WHERE fk_id_proyecto = $id_proyecto");
}
$stmt->close();

// --- GUARDAR DETALLES (LISTAS DINÁMICAS) ---
if (!empty($datos['inversiones'])) {
    $sql_inversion = "INSERT INTO inversiones (fk_id_proyecto, nombre_activo, monto, vida_util_anios, metodo_depreciacion) VALUES (?, ?, ?, ?, ?)";
    $stmt_inversion = $conexion->prepare($sql_inversion);
    foreach ($datos['inversiones'] as $inversion) {
        $stmt_inversion->bind_param("isdis", $id_proyecto, $inversion['nombre'], $inversion['monto'], $inversion['vida_util'], $inversion['tipo']);
        $stmt_inversion->execute();
    }
    $stmt_inversion->close();
}
// ... (Aquí irían los bloques para guardar las otras listas, si las tuvieras) ...


header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'Proyecto guardado correctamente.']);
$conexion->close();
?>