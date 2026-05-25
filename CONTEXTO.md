# 📊 CONTEXTO DEL PROYECTO — Calculadora Financiera UAA

## 🎯 Descripción
Aplicación web tipo SaaS para proyección, cotización y valuación financiera de proyectos.
Desarrollada para la **Universidad Autónoma de Aguascalientes (UAA)**.

---

## 🚀 Stack Tecnológico
- **Frontend:** HTML5, JavaScript, Tailwind CSS, Chart.js
- **Backend:** PHP 8.2 (Apache)
- **Base de Datos:** Oracle Database XE 21c
- **Infraestructura:** Docker & Docker Compose
- **APIs Externas:** open.er-api.com (tipo de cambio), World Bank API (inflación)
- **WebSockets:** PHP Ratchet/ReactPHP (tipo de cambio en tiempo real)

---

## 🖥️ Servidor AWS
- **IP Actual:** `18.225.224.77` ⚠️ (cambió de 18.218.15.145 al subir a t3.medium... luego fue c7i-flex.large)
- **Tipo de instancia:** c7i-flex.large (4GB RAM — necesario para Oracle 21c)
- **Usuario SSH:** `ubuntu`
- **Llave:** `llave-aws.pem` (en Downloads del usuario)
- **Comando SSH:** `ssh -i "C:\Users\CESAREDUARDOJUAREZJA\Downloads\llave-aws.pem" ubuntu@18.225.224.77`

---

## 🐳 Docker
Tres contenedores:
- `apache_calculadora` — PHP + Apache (puerto 8080)
- `websocket_calculadora` — Ratchet WebSocket (puerto 8081)
- `oracle_db` — Oracle XE 21c (puerto 1521)

**Comandos útiles:**
```bash
docker compose up -d          # Levantar todo
docker ps                     # Ver contenedores
docker exec -it apache_calculadora bash   # Entrar al contenedor web
docker exec -it oracle_db bash            # Entrar a Oracle
```

---

## 🗄️ Base de Datos Oracle
- **Servicio:** XEPDB1 (NO usar XE — es Oracle 21c)
- **Usuario app:** `usuario_finanzas` / `admin1234`
- **Conectar:** `sqlplus usuario_finanzas/admin1234@//localhost:1521/XEPDB1`
- **Admin:** `sqlplus / as sysdba` → `ALTER SESSION SET CONTAINER = XEPDB1;`

### Tablas:
- `proyectos` — datos principales del proyecto
- `usuarios` — autenticación
- `inversiones` — activos fijos
- `materias_primas` — receta del producto
- `gastos_administrativos` — gastos admin mensuales
- `gastos_ventas` — % sobre ventas
- `gastos_indirectos_fijos` — gastos fijos anuales de producción
- `gastos_indirectos_variables` — gastos variables por unidad

### Columnas especiales en `proyectos`:
```sql
ind_monto_deuda, ind_tasa_deuda, ind_tasa_socios, 
ind_tasa_impuestos, ind_plazo_credito, inv_inicial_pt_val
```

---

## 📁 Estructura de Archivos
```
/var/www/html/          (dentro del contenedor apache_calculadora)
├── index.html          (app principal — 7 pestañas fusionadas)
├── login.html          (página de login/registro)
├── js/
│   └── app.js          (toda la lógica JS — ~1700+ líneas)
├── api/
│   ├── conexion.php    (usa XEPDB1)
│   ├── login.php
│   ├── logout.php
│   ├── registro.php    (tiene OCI_COMMIT_ON_SUCCESS)
│   ├── guardar_proyecto.php  (tiene OCI_COMMIT_ON_SUCCESS en todos)
│   ├── cargar_proyectos.php
│   ├── obtener_proyecto.php
│   └── borrar_proyecto.php
└── style/
    └── style.css
```

---

## 📂 GitHub
- **Repo:** `https://github.com/cjuarezjasso-gif/calculadora-proyectos`
- **Rama activa:** `mejoras-cesar`
- **Comandos sync:**
```bash
# Servidor → GitHub
docker cp apache_calculadora:/var/www/html/js/app.js /home/ubuntu/calculadora/js/app.js
cd /home/ubuntu/calculadora
git add .
git commit -m "descripción"
git push origin mejoras-cesar

# GitHub → PC
git pull origin mejoras-cesar
```

---

## 🏗️ Arquitectura del Frontend (7 Pestañas)
El `index.html` tiene 7 pasos fusionados (antes eran 17 pestañas):

1. **Mercado y Ventas** (`tab-mercado`) — Secciones A, B, C
   - A: Mercado Meta y Concentración
   - B: Proyección de Ventas y Penetración  
   - C: Presupuesto de Ingresos (precio + unidades)

2. **Producción y Materia Prima** (`tab-produccion`) — Secciones A, B, C
   - A: Presupuesto de Producción
   - B: Receta del Producto (Materia Prima)
   - C: Presupuesto de Compras MP

3. **Mano de Obra y Gastos Indirectos** (`tab-costos`) — Secciones A, B
   - A: Mano de Obra Directa
   - B: Gastos Indirectos de Producción (fijos + variables)

4. **Inversiones y Gastos Operación** (`tab-inversiones-gastos`) — Secciones A, B
   - A: Activos Fijos, Depreciación y Amortización
   - B: Gastos Admin (mensuales) + Gastos Ventas (% sobre ventas)

5. **Condiciones Comerciales** (`condiciones`)
   - Días crédito clientes/proveedores, descuento pronto pago

6. **Estados Financieros** (`tab-resultados`) — Secciones A-E
   - A: Costo de Producción y de lo Vendido
   - B: Valuación de Inventarios Finales
   - C: Estado de Resultados (con PTU, Gastos Financieros, PE, Razones Financieras, GAO/GAF/GAT)
   - D: Flujo de Efectivo y Resumen Ejecutivo
   - E: Balance General

7. **Indicadores Financieros** (`tab-financiero`)
   - WACC, VPN, TIR, TRI, B/C, Tabla de Amortización

---

## ⚙️ Funciones Principales del app.js

| Función | Descripción |
|---------|-------------|
| `calcularPlan()` | Mercado Meta |
| `calcularFactSensibil()` | Proyección de ventas |
| `calcularPptoVtas()` | Presupuesto de ingresos |
| `calcularPptoProd()` | Presupuesto de producción |
| `calcularPptoMtp()` | Materia prima |
| `calcularComprasMP()` | Compras de MP |
| `calcularPptoMO()` | Mano de obra |
| `calcularGastosIndirectos()` | GIP fijos y variables |
| `calcularInversiones()` | Depreciación |
| `calcularGastosOperacion()` | Gastos admin + ventas |
| `calcularCondicionesComerciales()` | Crédito y descuentos |
| `calcularCostoProduccion()` | Costo de producción y vendido |
| `calcularValuacionInv()` | Valuación inventarios |
| `calcularEstadoResultados()` | ERI + PE + Razones + Apalancamiento |
| `calcularFlujoEfectivo()` | Flujo de efectivo |
| `calcularEstadoSituacion()` | Balance general |
| `calcularIndicadoresFinancieros()` | WACC, VPN, TIR, TRI, B/C |
| `guardarProyecto()` | Guarda en Oracle |
| `cargarProyecto()` | Carga desde Oracle |

---

## 🔧 Fixes Importantes Aplicados
1. `OCI_COMMIT_ON_SUCCESS` en todos los `oci_execute()` de `registro.php` y `guardar_proyecto.php`
2. WebSocket IP: `ws://18.225.224.77:8081`
3. `conexion.php` usa `//oracle_db:1521/XEPDB1`
4. `inv_inicial_prod` → ID correcto en guardar/cargar
5. `inv_inicial_pt_val` → campo separado para Inv. Inicial PT ($)
6. `calcularPptoMtp()` se llama antes de `actualizarCostosMP()` al cargar proyecto
7. Gastos admin/ventas: selector directo por clase, no por `.gasto-admin-item`
8. `calcularEstadoResultados()` incluye PTU, Gastos Financieros, UAI, PE, Razones Financieras, GAO/GAF/GAT

---

## 📐 Fórmulas Clave del Estado de Resultados
```
Utilidad Bruta = Ingresos - Costo de lo Vendido
UAII = Utilidad Bruta - Gastos Operación - Depreciación
Gastos Financieros = Saldo crédito × Tasa interés (decrece cada año)
UAI = UAII - Gastos Financieros
PTU = UAI × 10% (si UAI > 0)
ISR = UAI × tasa ISR (si UAI > 0)
Utilidad Neta = UAI - PTU - ISR

Punto de Equilibrio = Costos Fijos / (1 - Costos Variables/Ventas)

GAO = Margen de Contribución / UAII
GAF = UAII / UAI
GAT = GAO × GAF
```

---

## 📊 Ejercicio de Validación — Lácteos UAA
Datos ingresados para verificar cálculos:
- Población: 36,310 | Precio base: $43.98 | Unidades año 1: 36,310
- Inversión total: $1,340,263 | Deuda: $1,072,210 (18% a 5 años)
- Rendimiento socios: 30% | ISR: 30%

**Resultados esperados Año 1:**
- Ingresos: ~$1,596,913
- UAII: ~$529,658
- Gastos Financieros: $192,997
- UAI: ~$336,660
- Utilidad Neta: ~$201,996
- WACC: 16.08% | VPN: $1,370,947 | TIR: 47.11% | B/C: 1.65
- TRI: 2 años 3 meses ✅ VIABLE

---

## 👤 Usuario
- **Nombre:** César Eduardo Juárez Jasso
- **Universidad:** UAA — Aguascalientes
- **GitHub:** cjuarezjasso-gif
- **PC:** Windows, PowerShell, VSCode
- **Carpeta proyecto:** `C:\Users\CESAREDUARDOJUAREZJA\Calculadora`
