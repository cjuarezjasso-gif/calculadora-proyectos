<?php
// ACTIVAR ERRORES PARA DEPURACIÓN
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);

// Verificamos si es un proyecto existente o uno nuevo
$id_proyecto = isset($datos['id_proyecto']) && !empty($datos['id_proyecto']) ? $datos['id_proyecto'] : null;

// --- ESTA ES LA PARTE QUE FALTABA ---

// Lista de todos los campos que vienen de app.js y coinciden con la tabla 'proyectos'
$campos = [
    'nombre_proyecto', 'poblacion_total', 'pct_mujeres', 'pct_rango_edad', 
    'pct_poblacion_ocupada', 'pct_concentracion_mercado', 'participacion_mercado', 
    'incremento_poblacion', 'incremento_producto', 'penetracion_inicial', 
    'incremento_penetracion', 'precio_unitario_base', 'incremento_precio', 
    'unidades_venta_a1', 'unidades_venta_a2', 'unidades_venta_a3', 
    'unidades_venta_a4', 'unidades_venta_a5', 'dias_credito_ventas', 
    'dias_credito_compras', 'descuento_pronto_pago', 'inv_inicial_prod', 
    'inv_final_a1', 'inv_final_a2', 'inv_final_a3', 'inv_final_a4', 'inv_final_a5', 
    'inv_inicial_mp', 'inv_final_mp_pct', 'tiempo_unidad_mo', 'costo_hora_mo',
    'inversion_inicial'
];
// Tipos de datos para bind_param: s=string, i=integer, d=double/decimal
$tipos = 's' . str_repeat('d', 17) . 'ii' . str_repeat('d', 11) . 'd';

if (empty($id_proyecto)) {
    // --- Lógica INSERT (Crear proyecto nuevo) ---
    
    $columnas_sql = implode(', ', $campos);
    $placeholders = implode(', ', array_fill(0, count($campos), '?'));
    
    $sql = "INSERT INTO proyectos ($columnas_sql) VALUES ($placeholders)";
    $stmt = $conexion->prepare($sql);

    $valores = [];
    foreach ($campos as $campo) {
        $valores[] = $datos[$campo] ?? null; // Usar null si la llave no existe
    }
    
    $stmt->bind_param($tipos, ...$valores);
    $stmt->execute();
    $id_proyecto = $conexion->insert_id; // Obtenemos el ID del nuevo proyecto
    $stmt->close();
    
} else {
    // --- Lógica UPDATE (Actualizar proyecto existente) ---
    
    $set_sql = [];
    foreach ($campos as $campo) {
        $set_sql[] = "$campo = ?";
    }
    $set_sql_string = implode(', ', $set_sql);

    $sql = "UPDATE proyectos SET $set_sql_string WHERE id_proyecto = ?";
    $stmt = $conexion->prepare($sql);

    $valores = [];
    foreach ($campos as $campo) {
        $valores[] = $datos[$campo] ?? null;
    }
    $valores[] = $id_proyecto; // Añadimos el ID al final para el WHERE
    
    $stmt->bind_param($tipos . 'i', ...$valores); // Añadimos 'i' para el id_proyecto
    $stmt->execute();
    $stmt->close();
    
    // Y la lógica de BORRAR detalles viejos
    $conexion->query("DELETE FROM inversiones WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM materias_primas WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_administrativos WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_ventas WHERE fk_id_proyecto = $id_proyecto");
    $conexion->query("DELETE FROM gastos_indirectos_fijos WHERE fk_id_proyecto = $id_proyecto"); 
    $conexion->query("DELETE FROM gastos_indirectos_variables WHERE fk_id_proyecto = $id_proyecto"); 
}

// --- FIN DE LA PARTE QUE FALTABA ---


// --- GUARDAR DETALLES (TODOS LOS BLOQUES) ---
// (Esta parte ya la tenías bien)
if (!empty($datos['inversiones'])) {
    $sql_inversion = "INSERT INTO inversiones (fk_id_proyecto, nombre_activo, monto, vida_util_anios, metodo_depreciacion) VALUES (?, ?, ?, ?, ?)";
    $stmt_inversion = $conexion->prepare($sql_inversion);
    foreach ($datos['inversiones'] as $inversion) {
        $stmt_inversion->bind_param("isdis", $id_proyecto, $inversion['nombre'], $inversion['monto'], $inversion['vida_util'], $inversion['tipo']);
        $stmt_inversion->execute();
    }
    $stmt_inversion->close();
}

if (!empty($datos['materias_primas'])) {
    $sql_mp = "INSERT INTO materias_primas (fk_id_proyecto, nombre_mp, cantidad_por_unidad_prod, unidad_medida, costo_unitario) VALUES (?, ?, ?, ?, ?)";
    $stmt_mp = $conexion->prepare($sql_mp);
    foreach ($datos['materias_primas'] as $mp) {
        $stmt_mp->bind_param("isdsd", $id_proyecto, $mp['nombre'], $mp['cantidad'], $mp['unidad'], $mp['costo_unitario']);
        $stmt_mp->execute();
    }
    $stmt_mp->close();
}

if (!empty($datos['gastos_admin'])) {
    $sql_ga = "INSERT INTO gastos_administrativos (fk_id_proyecto, concepto, monto_mensual) VALUES (?, ?, ?)";
    $stmt_ga = $conexion->prepare($sql_ga);
    foreach ($datos['gastos_admin'] as $gasto) {
        $stmt_ga->bind_param("isd", $id_proyecto, $gasto['concepto'], $gasto['monto_mensual']);
        $stmt_ga->execute();
    }
    $stmt_ga->close();
}

if (!empty($datos['gastos_ventas'])) {
    $sql_gv = "INSERT INTO gastos_ventas (fk_id_proyecto, concepto, porcentaje_sobre_ventas) VALUES (?, ?, ?)";
    $stmt_gv = $conexion->prepare($sql_gv);
    foreach ($datos['gastos_ventas'] as $gasto) {
        $stmt_gv->bind_param("isd", $id_proyecto, $gasto['concepto'], $gasto['porcentaje_sobre_ventas']);
        $stmt_gv->execute();
    }
    $stmt_gv->close();
}


if (!empty($datos['gastos_fijos'])) {
    $sql = "INSERT INTO gastos_indirectos_fijos (fk_id_proyecto, concepto, monto_anual) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    foreach ($datos['gastos_fijos'] as $gasto) {
        $stmt->bind_param("isd", $id_proyecto, $gasto['concepto'], $gasto['monto_anual']);
        $stmt->execute();
    }
    $stmt->close();
}

if (!empty($datos['gastos_variables'])) {
    $sql = "INSERT INTO gastos_indirectos_variables (fk_id_proyecto, concepto, por_unidad, unidad) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    foreach ($datos['gastos_variables'] as $gasto) {
        $stmt->bind_param("isds", $id_proyecto, $gasto['concepto'], $gasto['por_unidad'], $gasto['unidad']);
        $stmt->execute();
    }
    $stmt->close();
}

header('Content-Type: application/json');
// Devolvemos el ID del proyecto y un mensaje de éxito
echo json_encode(['status' => 'success', 'message' => 'Proyecto guardado correctamente.', 'id_proyecto' => $id_proyecto]);
$conexion->close();
?>