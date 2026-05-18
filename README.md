# 📊 Calculadora de Análisis Financiero de Proyectos

Una aplicación web tipo SaaS (Software as a Service) diseñada para la proyección, cotización y valuación financiera de proyectos. Cuenta con un sistema multi-usuario, cotizaciones de divisas, cálculo dinámico de inflación y comunicación en tiempo real.

## 🚀 Tecnologías Utilizadas
* **Frontend:** HTML5, JavaScript, Tailwind CSS, Chart.js.
* **Backend:** PHP 8.2 (Apache).
* **Base de Datos:** Oracle Database (XE 21c).
* **Infraestructura:** Docker & Docker Compose.
* **APIs Externas:** World Bank API (Inflación), APIs de Divisas.
* **Comunicación:** WebSockets (PHP Sockets).

---

## ⚙️ Requisitos Previos
Para ejecutar este proyecto en tu computadora local, necesitas tener instalado:
1. [Git](https://git-scm.com/downloads)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Asegúrate de que esté abierto y la ballenita esté en verde).

---

## 🛠️ Instrucciones de Instalación

**1. Clonar el repositorio**
Abre tu terminal y descarga el código:
```bash
git clone [https://github.com/TU_USUARIO/calculadora-proyectos.git](https://github.com/TU_USUARIO/calculadora-proyectos.git)
cd calculadora-proyectos
2. Descargar las dependencias de PHP (Librerías)
Ejecuta este comando para descargar los "ingredientes" necesarios para los WebSockets (creará la carpeta vendor automáticamente usando Docker):

Bash
docker run --rm -v ${PWD}:/app composer install
3. Levantar la infraestructura
Ejecuta el siguiente comando para levantar la base de datos Oracle, el servidor Apache y los WebSockets de forma automática:

Bash
docker compose up -d
(Nota: La base de datos Oracle tomará un par de minutos en construirse y configurar las tablas automáticamente la primera vez. ¡Ten paciencia!)

4. Entrar a la aplicación
Una vez que el comando termine, abre tu navegador web y entra a:
👉 http://localhost:8080

💡 Notas Importantes
Base de Datos Automática: No necesitas ejecutar scripts SQL manualmente. La base de datos se autoconstruye usando el archivo init.sql en su primer arranque.

WebSockets: El servidor de WebSockets arranca solo. El indicador en la barra superior se pondrá en verde 🟢 cuando la conexión y la base de datos estén listas.

Apagar el proyecto: Para detener todo y no consumir memoria cuando no estés trabajando:

Bash
docker compose down

Recuerda que en la parte de **`https://github.com/TU_USUARIO/calculadora-proyectos.git`** debes cambiar `TU_USUARIO` por tu usuario real de GitHub para que el link funcione perfecto. 

