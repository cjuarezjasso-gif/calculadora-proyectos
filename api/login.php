<?php
// 🔥 Iniciamos el motor de sesiones de PHP
session_start();
require_once 'conexion.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$correo = $data['correo'] ?? '';
$password = $data['password'] ?? '';

// Buscamos al usuario por su correo
$sql = "SELECT id_usuario, nombre, password FROM usuarios WHERE correo = :correo";
$stmt = oci_parse($conexion, $sql);
oci_bind_by_name($stmt, ':correo', $correo);
oci_execute($stmt);

$user = oci_fetch_assoc($stmt);

// Si el usuario existe y la contraseña encriptada coincide
if ($user && password_verify($password, $user['PASSWORD'])) {
    
    // Le ponemos su "Gafete Virtual" de acceso
    $_SESSION['id_usuario'] = $user['ID_USUARIO'];
    $_SESSION['nombre'] = $user['NOMBRE'];
    
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido ' . $user['NOMBRE']]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos']);
}

oci_free_statement($stmt);
oci_close($conexion);
?>