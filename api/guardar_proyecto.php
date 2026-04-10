<?php
// ACTIVAR ERRORES PARA DEPURACIÓN
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'conexion.php';
$datos = json_decode(file_get_contents('php://input'), true);

$id_proyecto = isset($datos['id_proyecto']) && !empty($datos['id_proyecto']) ? $datos['id_proyecto'] : null;

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
    'inversion_inicial', 'inflacion_anual',
    'saldo_inicial', 'pct_cobro_efectivo'
];

// Arreglo temporal para guardar las variables y que Oracle pueda leerlas
$bind_vars = [];

if (empty($id_proyecto)) {
    // --- INSERT: ORACLE STYLE ---
    $columnas_sql = implode(', ', $campos);
    $placeholders = [];
    foreach ($campos as $campo) {
        $placeholders[] = ':' . $campo;
    }
    $placeholders_sql = implode(', ', $placeholders);
    
    // En Oracle pedimos el ID de regreso con RETURNING
    $sql = "INSERT INTO proyectos ($columnas_sql) VALUES ($placeholders_sql) RETURNING id_proyecto INTO :id_generado";
    $stmt = oci_parse($conexion, $sql);

    foreach ($campos as $campo) {
        $bind_vars[$campo] = $datos[$campo] ?? null;
        oci_bind_by_name($stmt, ':' . $campo, $bind_vars[$campo]);
    }
    
    // Variable para atrapar el nuevo ID
    $nuevo_id = 0;
    oci_bind_by_name($stmt, ':id_generado', $nuevo_id, -1, SQLT_INT);
    
    oci_execute($stmt);
    $id_proyecto = $nuevo_id; 
    oci_free_statement($stmt);
    
} else {
    // --- UPDATE: ORACLE STYLE ---
    $set_sql = [];
    foreach ($campos as $campo) {
        $set_sql[] = "$campo = :$campo";
    }
    $set_sql_string = implode(', ', $set_sql);

    $sql = "UPDATE proyectos SET $set_sql_string WHERE id_proyecto = :id_proyecto";
    $stmt = oci_parse($conexion, $sql);

    foreach ($campos as $campo) {
        $bind_vars[$campo] = $datos[$campo] ?? null;
        oci_bind_by_name($stmt, ':' . $campo, $bind_vars[$campo]);
    }
    oci_bind_by_name($stmt, ':id_proyecto', $id_proyecto);
    
    oci_execute($stmt);
    oci_free_statement($stmt);
    
    // Lógica para borrar detalles viejos optimizada para Oracle
    $tablas_limpiar = ['inversiones', 'materias_primas', 'gastos_administrativos', 'gastos_ventas', 'gastos_indirectos_fijos', 'gastos_indirectos_variables'];
    foreach ($tablas_limpiar as $tabla) {
        $sql_del = "DELETE FROM $tabla WHERE fk_id_proyecto = :id";
        $stmt_del = oci_parse($conexion, $sql_del);
        oci_bind_by_name($stmt_del, ':id', $id_proyecto);
        oci_execute($stmt_del);
        oci_free_statement($stmt_del);
    }
}

// --- GUARDAR DETALLES ---

if (!empty($datos['inversiones'])) {
    $sql_inversion = "INSERT INTO inversiones (fk_id_proyecto, nombre_activo, monto, vida_util_anios, metodo_depreciacion) VALUES (:id, :nombre, :monto, :vida, :metodo)";
    $stmt_inversion = oci_parse($conexion, $sql_inversion);
    foreach ($datos['inversiones'] as $inversion) {
        $nombre = $inversion['nombre']; $monto = $inversion['monto']; $vida = $inversion['vida_util']; $metodo = $inversion['tipo'];
        oci_bind_by_name($stmt_inversion, ':id', $id_proyecto);
        oci_bind_by_name($stmt_inversion, ':nombre', $nombre);
        oci_bind_by_name($stmt_inversion, ':monto', $monto);
        oci_bind_by_name($stmt_inversion, ':vida', $vida);
        oci_bind_by_name($stmt_inversion, ':metodo', $metodo);
        oci_execute($stmt_inversion);
    }
    oci_free_statement($stmt_inversion);
}

if (!empty($datos['materias_primas'])) {
    $sql_mp = "INSERT INTO materias_primas (fk_id_proyecto, nombre_mp, cantidad_por_unidad_prod, unidad_medida, costo_unitario) VALUES (:id, :nombre, :cant, :unidad, :costo)";
    $stmt_mp = oci_parse($conexion, $sql_mp);
    foreach ($datos['materias_primas'] as $mp) {
        $nombre = $mp['nombre']; $cant = $mp['cantidad']; $unidad = $mp['unidad']; $costo = $mp['costo_unitario'];
        oci_bind_by_name($stmt_mp, ':id', $id_proyecto);
        oci_bind_by_name($stmt_mp, ':nombre', $nombre);
        oci_bind_by_name($stmt_mp, ':cant', $cant);
        oci_bind_by_name($stmt_mp, ':unidad', $unidad);
        oci_bind_by_name($stmt_mp, ':costo', $costo);
        oci_execute($stmt_mp);
    }
    oci_free_statement($stmt_mp);
}

if (!empty($datos['gastos_admin'])) {
    $sql_ga = "INSERT INTO gastos_administrativos (fk_id_proyecto, concepto, monto_mensual) VALUES (:id, :concepto, :monto)";
    $stmt_ga = oci_parse($conexion, $sql_ga);
    foreach ($datos['gastos_admin'] as $gasto) {
        $concepto = $gasto['concepto']; $monto = $gasto['monto_mensual'];
        oci_bind_by_name($stmt_ga, ':id', $id_proyecto);
        oci_bind_by_name($stmt_ga, ':concepto', $concepto);
        oci_bind_by_name($stmt_ga, ':monto', $monto);
        oci_execute($stmt_ga);
    }
    oci_free_statement($stmt_ga);
}

if (!empty($datos['gastos_ventas'])) {
    $sql_gv = "INSERT INTO gastos_ventas (fk_id_proyecto, concepto, porcentaje_sobre_ventas) VALUES (:id, :concepto, :pct)";
    $stmt_gv = oci_parse($conexion, $sql_gv);
    foreach ($datos['gastos_ventas'] as $gasto) {
        $concepto = $gasto['concepto']; $pct = $gasto['porcentaje_sobre_ventas'];
        oci_bind_by_name($stmt_gv, ':id', $id_proyecto);
        oci_bind_by_name($stmt_gv, ':concepto', $concepto);
        oci_bind_by_name($stmt_gv, ':pct', $pct);
        oci_execute($stmt_gv);
    }
    oci_free_statement($stmt_gv);
}

if (!empty($datos['gastos_fijos'])) {
    $sql_gf = "INSERT INTO gastos_indirectos_fijos (fk_id_proyecto, concepto, monto_anual) VALUES (:id, :concepto, :monto)";
    $stmt_gf = oci_parse($conexion, $sql_gf);
    foreach ($datos['gastos_fijos'] as $gasto) {
        $concepto = $gasto['concepto']; $monto = $gasto['monto_anual'];
        oci_bind_by_name($stmt_gf, ':id', $id_proyecto);
        oci_bind_by_name($stmt_gf, ':concepto', $concepto);
        oci_bind_by_name($stmt_gf, ':monto', $monto);
        oci_execute($stmt_gf);
    }
    oci_free_statement($stmt_gf);
}

if (!empty($datos['gastos_variables'])) {
    $sql_gva = "INSERT INTO gastos_indirectos_variables (fk_id_proyecto, concepto, por_unidad, unidad) VALUES (:id, :concepto, :por_unidad, :unidad)";
    $stmt_gva = oci_parse($conexion, $sql_gva);
    foreach ($datos['gastos_variables'] as $gasto) {
        $concepto = $gasto['concepto']; $pu = $gasto['por_unidad']; $uni = $gasto['unidad'];
        oci_bind_by_name($stmt_gva, ':id', $id_proyecto);
        oci_bind_by_name($stmt_gva, ':concepto', $concepto);
        oci_bind_by_name($stmt_gva, ':por_unidad', $pu);
        oci_bind_by_name($stmt_gva, ':unidad', $uni);
        oci_execute($stmt_gva);
    }
    oci_free_statement($stmt_gva);
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'message' => 'Proyecto guardado correctamente.', 'id_proyecto' => $id_proyecto]);
oci_close($conexion);
?>