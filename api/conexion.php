<?php
// === CONEXIÓN OFICIAL PARA ORACLE EN DOCKER ===

$username = 'system';
$password = 'admin1234';
// Usamos 'oracle_db' como host porque tu PHP y tu BD se comunican por dentro de Docker
$database = '//oracle_db:1521/XEPDB1'; 

// Intentamos abrir la conexión con Oracle
$conexion = @oci_connect($username, $password, $database, 'AL32UTF8');

if (!$conexion) {
    $m = oci_error();
    // Si falla, mandamos el error en formato JSON para que tu JavaScript lo entienda
    echo json_encode(['error' => 'Error de conexión a Oracle: ' . $m['message']]);
    exit;
}
?>