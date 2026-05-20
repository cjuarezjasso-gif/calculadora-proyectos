<?php
// === CONEXIÓN OFICIAL PARA ORACLE EN DOCKER ===

$username = 'usuario_finanzas'; 
$password = 'admin1234';
$database = '//oracle_db:1521/XE'; 

// Intentamos abrir la conexión con Oracle
$conexion = @oci_pconnect($username, $password, $database, 'AL32UTF8');

if (!$conexion) {
    $m = oci_error();
    // Si falla, mandamos el error en formato JSON para que tu JavaScript lo entienda
    echo json_encode(['error' => 'Error de conexión a Oracle: ' . $m['message']]);
    exit;
}
?>