<?php
session_start();
session_unset();    // Limpia las variables
session_destroy();  // Destruye el gafete virtual
echo json_encode(['status' => 'success']);
?>