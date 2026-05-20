<?php
require_once 'conexion.php';
header('Content-Type: application/json');

// Recibimos los datos que manda el JavaScript
$data = json_decode(file_get_contents("php://input"), true);
$nombre = $data['nombre'] ?? '';
$correo = $data['correo'] ?? '';
$password = $data['password'] ?? '';

// Validamos que no vengan vacíos
if (empty($nombre) || empty($correo) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

// 🔥 Encriptación profesional de contraseña
$pass_hashed = password_hash($password, PASSWORD_DEFAULT);

// Preparamos la inyección segura a Oracle
$sql = "INSERT INTO usuarios (nombre, correo, password) VALUES (:nombre, :correo, :pass)";
$stmt = oci_parse($conexion, $sql);
oci_bind_by_name($stmt, ':nombre', $nombre);
oci_bind_by_name($stmt, ':correo', $correo);
oci_bind_by_name($stmt, ':pass', $pass_hashed);

if (@oci_execute($stmt, OCI_COMMIT_ON_SUCCESS)) {
    echo json_encode(['status' => 'success', 'message' => 'Usuario registrado exitosamente']);
} else {
    // Si el correo ya existe, Oracle manda un error y lo cachamos aquí
    echo json_encode(['status' => 'error', 'message' => 'El correo ya está registrado']);
}

oci_free_statement($stmt);
oci_close($conexion);
?>