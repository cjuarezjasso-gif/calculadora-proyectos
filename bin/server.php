<?php
require dirname(__DIR__) . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class TipoCambioSocket implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nuevo cliente conectado ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido: $msg\n";
        
        // 1. Decodificamos el mensaje (JSON) para saber qué moneda quiere el usuario
        $dataCliente = json_decode($msg, true);
        $precio = 0;

        // Verificamos si es una petición válida
        if (isset($dataCliente['accion']) && $dataCliente['accion'] === 'pedir_tipo_cambio') {
            
            // Obtenemos la moneda base elegida (USD, MXN, EUR). Si no hay, usamos USD.
            $monedaBase = $dataCliente['moneda'] ?? 'USD'; 
            
            // --- INICIO LÓGICA API ---
            // Usamos la variable $monedaBase en la URL para pedir la correcta
            $apiUrl = "https://open.er-api.com/v6/latest/$monedaBase";
            $json = @file_get_contents($apiUrl);

            if ($json !== false) {
                $datos = json_decode($json, true);
                
                // Si la moneda base es MXN, el valor es 1.0
                if ($monedaBase === 'MXN') {
                    $precio = 1.0;
                } elseif (isset($datos['rates']['MXN'])) {
                    // Si es otra moneda (USD o EUR), obtenemos cuánto vale en PESOS
                    $precio = $datos['rates']['MXN'];
                }
            }
            
            // Si falló la API o no hay internet, usamos simulación
            if ($precio == 0) {
                $precio = rand(1800, 2200) / 100;
            }
            
            // --- FIN LÓGICA API ---

            // Configurar zona horaria de México
            date_default_timezone_set('America/Mexico_City');
            $inflacionSimulada = rand(400, 550) / 100;
            // 2. Preparamos la respuesta final
            $respuesta = json_encode([
                'tipo' => 'tipo_cambio_actualizado',
                'valor' => $precio,
                'inflacion' => $inflacionSimulada, 
                'moneda_base' => $monedaBase,
                'fecha' => date('H:i:s')
            ]);
            
            // Enviar a TODOS los clientes conectados
            foreach ($this->clients as $client) {
                $client->send($respuesta);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Cliente desconectado ({$conn->resourceId})\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

// Configuración del servidor en el puerto 8081
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new TipoCambioSocket()
        )
    ),
    8081,
    '0.0.0.0'
);

echo "✅ Servidor WebSocket iniciado en ws://0.0.0.0:8081\n";
$server->run();