# Calculadora
Calculadora financiera como proyecto
🚀 Guía de Instalación para el Equipo (Calculadora Financiera)
Requisitos previos:

Tener Git instalado.

Tener Docker Desktop instalado y abierto.

Paso 1: Descargar el código
Abre tu terminal, ve a la carpeta donde quieras guardar el proyecto (ej. htdocs o Documentos) y ejecuta:

Bash
git clone https://github.com/cjuarezjasso-gif/calculadora-proyectos.git
Entra a la carpeta del proyecto:

Bash
cd calculadora-proyectos
Paso 2: Levantar los servidores (Docker)
Asegúrate de que Docker esté corriendo en tu compu y levanta los contenedores de Apache/PHP y Oracle ejecutando:

Bash
docker-compose up -d
(Espera un par de minutos a que la base de datos de Oracle termine de inicializarse por completo).

Paso 3: Instalar las librerías de PHP
Como el proyecto usa WebSockets, necesitamos descargar las dependencias. Entra al contenedor de PHP y ejecuta Composer:

Bash
docker exec -it apache_calculadora bash
composer install
exit
Paso 4: Conectar la Base de Datos
Abre tu gestor de base de datos favorito (DBeaver, SQL Developer, etc.) y conéctate a Oracle con las credenciales del proyecto.

Ejecuta el archivo base_oracle.sql que viene en la carpeta principal para crear todas las tablas necesarias.

Paso 5: Encender el motor de Tiempo Real (WebSockets)
Para que funcionen el dólar en vivo y la inflación oficial, deja una terminal abierta corriendo este comando:

Bash
docker exec -it apache_calculadora php bin/server.php
(Te debe salir un mensaje con una palomita verde ✅ confirmando que inició. ¡No cierres esta terminal!)

Paso 6: ¡A programar!
Abre tu navegador y entra a: http://localhost/Calculadora (o el puerto que tengas configurado).
¡Listo! Ya tienes el proyecto al 100% en tu máquina.
