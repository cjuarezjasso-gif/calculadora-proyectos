// ===========================
// ALMACENAMIENTO GLOBAL DE DATOS
// ===========================
let globalData = {
    mercadoMeta: 0,
    porcentajeConcentracion: 0,
    penetracionMercado: [0,0,0,0,0],
    unidadesVenta: [0,0,0,0,0],
    precioUnitario: [0,0,0,0,0],
    incrementoUnidades: 0,
    ventasProyeccion: [0,0,0,0,0],
    unidadesProduccion: [0,0,0,0,0],
    materiaPrima: [],
    costoMP: [],
    consumoMP: [],
    comprasMP: [],
    costoMO: [0,0,0,0,0],
    gastosIndirectos: [0,0,0,0,0],
    costoProduccion: [0,0,0,0,0],
    costoVendido: [0,0,0,0,0],
    costoUnitarioProduccion: [0,0,0,0,0],
    gastosOperacion: [0,0,0,0,0],
    diasCredito: {ventas: 0, compras: 0},
    descuentoProntoPago: 0,
    inversionesActivo: [],
    depreciacion: [0,0,0,0,0],
    amortizacion: [0,0,0,0,0],
    utilidadNeta: [0,0,0,0,0],
    activoCirculante: [0,0,0,0,0],
    pasivoCirculante: [0,0,0,0,0],
    capital: [0,0,0,0,0]
};

// ===========================
// NAVEGACIÓN ENTRE PESTAÑAS
// ===========================
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// ===========================
// PESTAÑA 1: MERCADO META
// ===========================
function calcularPlan() {
    const poblacionTotal = parseFloat(document.getElementById('poblacion-total').value) || 0;
    const porcentajeMujeres = parseFloat(document.getElementById('porcentaje-mujeres').value) || 0;
    const rangoEdad = parseFloat(document.getElementById('rango-edad').value) || 0;
    const poblacionOcupada = parseFloat(document.getElementById('poblacion-ocupada').value) || 0;
    const concentracion = parseFloat(document.getElementById('concentracion-mercado').value) || 0;
    
    const mercadoMeta = poblacionTotal * (porcentajeMujeres/100) * (rangoEdad/100) * (poblacionOcupada/100);
    const mercadoConcentrado = mercadoMeta * (concentracion/100);
    
    globalData.mercadoMeta = mercadoMeta;
    globalData.porcentajeConcentracion = concentracion;
    
    document.getElementById('mercado-meta').textContent = Math.round(mercadoMeta).toLocaleString('es-MX');
    document.getElementById('mercado-concentrado').textContent = Math.round(mercadoConcentrado).toLocaleString('es-MX');
}

// ===========================
// PESTAÑA 2: PROYECCIÓN DE VENTAS
// ===========================
function calcularFactSensibil() {
    const participacionMercado = parseFloat(document.getElementById('participacion-mercado').value) || 0;
    const incrementoPoblacion = parseFloat(document.getElementById('incremento-poblacion').value) || 0;
    const incrementoProducto = parseFloat(document.getElementById('incremento-producto').value) || 0;
    const penetracionInicial = parseFloat(document.getElementById('penetracion-inicial').value) || 0;
    const incrementoPenetracion = parseFloat(document.getElementById('incremento-penetracion').value) || 0;
    
    const mercadoBase = globalData.mercadoMeta;
    
    if (mercadoBase === 0 && (participacionMercado > 0 || penetracionInicial > 0)) {
        document.getElementById('proyeccion-mercado').innerHTML = '<p class="text-red-500">Primero complete la sección de Mercado Meta</p>';
        return;
    }
    
    globalData.incrementoUnidades = incrementoProducto;
    
    let html = '<div class="space-y-2">';
    let mercadoPotencial = mercadoBase * (participacionMercado/100);
    let penetracion = penetracionInicial;
    
    for (let i = 1; i <= 5; i++) {
        if (i > 1) {
            mercadoPotencial *= (1 + (incrementoPoblacion + incrementoProducto)/100);
            penetracion += incrementoPenetracion;
        }
        
        const clientesPotenciales = Math.round(mercadoPotencial * (penetracion/100));
        globalData.penetracionMercado[i-1] = penetracion;
        
        html += `<div class="flex justify-between border-b pb-1">
            <span class="font-medium">Año ${i}:</span>
            <span class="text-indigo-600 font-semibold">${clientesPotenciales.toLocaleString('es-MX')} personas (${penetracion.toFixed(1)}% penetración)</span>
        </div>`;
    }
    html += '</div>';
    
    document.getElementById('proyeccion-mercado').innerHTML = html;
}

// ===========================
// PESTAÑA 3: PRESUPUESTO DE INGRESOS
// ===========================
function calcularPptoVtas() {
    const precioBase = parseFloat(document.getElementById('precio-unitario-base').value) || 0;
    const incrementoPrecio = parseFloat(document.getElementById('incremento-precio').value) || 0;
    
    let html = '<div class="space-y-2">';
    
    for (let i = 1; i <= 5; i++) {
        const precio = precioBase * Math.pow(1 + incrementoPrecio/100, i-1);
        globalData.precioUnitario[i-1] = precio;
        
        const unidades = parseFloat(document.getElementById(`unidades-${i}`).value) || 0;
        globalData.unidadesVenta[i-1] = unidades;
        const ventasAnuales = unidades * precio;
        globalData.ventasProyeccion[i-1] = ventasAnuales;
        
        html += `<div class="flex justify-between border-b pb-1">
            <span class="font-medium">Año ${i}: ${unidades.toLocaleString('es-MX')} × $${precio.toFixed(2)}</span>
            <span class="text-green-600 font-semibold">${ventasAnuales.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
        </div>`;
    }
    html += '</div>';
    
    document.getElementById('ventas-proyeccion').innerHTML = html;
    
    calcularPptoProd();
    calcularGastosOperacion();
    calcularCondicionesComerciales();
}

// ===========================
// PESTAÑA 4: CONDICIONES COMERCIALES
// ===========================
function calcularCondicionesComerciales() {
    const diasCreditoVentas = parseFloat(document.getElementById('dias-credito-ventas').value) || 0;
    const diasCreditoCompras = parseFloat(document.getElementById('dias-credito-compras').value) || 0;
    const descuento = parseFloat(document.getElementById('descuento-pronto-pago').value) || 0;
    
    globalData.diasCredito.ventas = diasCreditoVentas;
    globalData.diasCredito.compras = diasCreditoCompras;
    globalData.descuentoProntoPago = descuento;
    
    let html = '<div class="space-y-3">';
    
    for (let año = 0; año < 5; año++) {
        const ventasAnuales = globalData.ventasProyeccion[año] || 0;
        const comprasAnuales = globalData.comprasMP[año] || 0;
        
        const cuentasPorCobrar = ventasAnuales * (diasCreditoVentas / 360);
        const cuentasPorPagar = comprasAnuales * (diasCreditoCompras / 360);
        const descuentoObtenido = comprasAnuales * (descuento / 100);
        
        html += `<div class="border-b pb-2">
            <div class="font-semibold">Año ${año + 1}</div>
            <div class="text-sm text-gray-600">Cuentas por Cobrar: $${cuentasPorCobrar.toLocaleString('es-MX', {minimumFractionDigits: 0})}</div>
            <div class="text-sm text-gray-600">Cuentas por Pagar: $${cuentasPorPagar.toLocaleString('es-MX', {minimumFractionDigits: 0})}</div>
            <div class="text-sm text-green-600">Descuento obtenido: $${descuentoObtenido.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
        </div>`;
    }
    
    html += '</div>';
    document.getElementById('condiciones-comerciales-resultado').innerHTML = html;
    calcularEstadoResultados();
}

// ===========================
// PESTAÑA 5: INVERSIONES Y DEPRECIACIÓN
// ===========================
function agregarInversion(inversion = null) {
    const container = document.getElementById('inversiones-container');
    const newRow = document.createElement('div');
    newRow.className = 'inversion-item grid grid-cols-5 gap-2 mb-2 items-center';
    
    const nombre = inversion ? inversion.nombre_activo : '';
    const monto = inversion ? inversion.monto : '';
    const vida = inversion ? inversion.vida_util_anios : '';
    const tipo = inversion ? inversion.metodo_depreciacion : 'lineal';

    newRow.innerHTML = `
        <input type="text" placeholder="Nombre Activo" class="inv-nombre text-sm col-span-1" value="${nombre || ''}">
        <input type="number" placeholder="Monto" class="inv-monto text-sm col-span-1" step="0.01" value="${monto || ''}">
        <input type="number" placeholder="Vida útil" class="inv-vida text-sm col-span-1" value="${vida || ''}">
        <select class="inv-tipo text-sm col-span-1">
            <option value="lineal" ${tipo === 'lineal' ? 'selected' : ''}>Lineal</option>
            <option value="acelerada" ${tipo === 'acelerada' ? 'selected' : ''}>Acelerada</option>
        </select>
        <button onclick="calcularInversiones()" class="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs col-span-1">Calcular</button>
    `;
    container.appendChild(newRow);
}

function calcularInversiones() {
    const nombres = document.querySelectorAll('.inv-nombre');
    const montos = document.querySelectorAll('.inv-monto');
    const vidas = document.querySelectorAll('.inv-vida');
    const tipos = document.querySelectorAll('.inv-tipo');
    
    globalData.inversionesActivo = [];
    globalData.depreciacion = [0,0,0,0,0];
    
    let html = '<div class="space-y-4">';
    
    for (let i = 0; i < nombres.length; i++) {
        const nombre = nombres[i].value.trim();
        const monto = parseFloat(montos[i].value) || 0;
        const vidaUtil = parseFloat(vidas[i].value) || 1;
        const tipo = tipos[i].value;
        
        if (nombre && monto > 0) {
            const inversion = {
                nombre: nombre,
                monto: monto,
                vidaUtil: vidaUtil,
                tipo: tipo,
                depreciacionAnual: []
            };
            
            html += `<div class="border-b pb-3">
                <div class="font-semibold text-gray-700">${nombre} - $${monto.toLocaleString('es-MX')}</div>
                <div class="text-xs text-gray-500">Vida útil: ${vidaUtil} años - Método: ${tipo}</div>`;
            
            for (let año = 0; año < 5; año++) {
                let depreciacion = 0;
                if (tipo === 'lineal') {
                    depreciacion = año < vidaUtil ? monto / vidaUtil : 0;
                } else { 
                    const factor = 2 / vidaUtil;
                    let valorLibros = monto;
                    for (let a = 0; a < año; a++) {
                        valorLibros -= valorLibros * factor;
                    }
                    depreciacion = (año < vidaUtil && valorLibros > 0) ? Math.min(valorLibros, valorLibros * factor) : 0;
                }
                inversion.depreciacionAnual[año] = depreciacion;
                globalData.depreciacion[año] += depreciacion;
                html += `<div class="text-sm text-gray-600">Año ${año + 1}: $${depreciacion.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>`;
            }
            html += '</div>';
            globalData.inversionesActivo.push(inversion);
        }
    }
    html += '<div class="font-bold text-lg text-blue-600 mt-4">Depreciación Total por Año:</div>';
    for (let año = 0; año < 5; año++) {
        html += `<div class="flex justify-between text-lg">
            <span>Año ${año + 1}:</span>
            <span class="font-bold">$${globalData.depreciacion[año].toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
        </div>`;
    }
    html += '</div>';
    document.getElementById('inversiones-resultado').innerHTML = html;
    calcularEstadoResultados();
}

// ===========================
// PESTAÑA 6: PRODUCCIÓN
// ===========================
function calcularPptoProd() {
    const invInicial = parseFloat(document.getElementById('inv-inicial-prod').value) || 0;
    let html = '<div class="space-y-2">';
    
    for (let i = 1; i <= 5; i++) {
        const ventasProyectadas = globalData.unidadesVenta[i-1] || 0;
        const invFinal = parseFloat(document.getElementById(`inv-final-${i}`).value) || 0;
        const invInicialAnual = i === 1 ? invInicial : (parseFloat(document.getElementById(`inv-final-${i-1}`).value) || 0);
        
        const produccionRequerida = ventasProyectadas + invFinal - invInicialAnual;
        globalData.unidadesProduccion[i-1] = Math.max(0, produccionRequerida);
        
        html += `<div class="flex justify-between border-b pb-1">
            <span class="font-medium">Año ${i}:</span>
            <span class="text-blue-600 font-semibold">${Math.max(0, produccionRequerida).toLocaleString('es-MX')} unidades</span>
        </div>`;
    }
    html += '</div>';
    document.getElementById('produccion-proyeccion').innerHTML = html;
    calcularPptoMtp();
    calcularPptoMO();
}

// ===========================
// PESTAÑA 7: MATERIA PRIMA
// ===========================
function agregarMateriaPrima(mp = null) {
    const container = document.getElementById('receta-container');
    const newRow = document.createElement('div');
    newRow.className = 'mp-item grid grid-cols-3 gap-2 mb-2';

    const nombre = mp ? mp.nombre_mp : '';
    const cantidad = mp ? mp.cantidad_por_unidad_prod : '';
    const unidad = mp ? mp.unidad_medida : '';

    newRow.innerHTML = `
        <input type="text" placeholder="Materia Prima" class="receta-mp text-sm" onchange="calcularPptoMtp()" value="${nombre || ''}">
        <input type="number" placeholder="Cantidad por unidad" class="receta-cant text-sm" step="0.001" onchange="calcularPptoMtp()" value="${cantidad || ''}">
        <input type="text" placeholder="Unidad" class="receta-unidad text-sm" value="${unidad || ''}">
    `;
    container.appendChild(newRow);
}

function calcularPptoMtp() {
    const materiasPrimas = document.querySelectorAll('.receta-mp');
    const cantidades = document.querySelectorAll('.receta-cant');
    const unidades = document.querySelectorAll('.receta-unidad');
    
    globalData.materiaPrima = [];
    let html = '<div class="space-y-3">';
    
    for (let i = 0; i < materiasPrimas.length; i++) {
        const nombreMP = materiasPrimas[i].value.trim();
        const cantidadPorUnidad = parseFloat(cantidades[i].value) || 0;
        const unidad = unidades[i].value.trim();
        
        if (nombreMP && cantidadPorUnidad > 0) {
            const mpData = {
                nombre: nombreMP,
                cantidadPorUnidad: cantidadPorUnidad,
                unidad: unidad || 'unidad',
                consumoAnual: []
            };
            globalData.materiaPrima.push(mpData);
            html += `<div class="border-b pb-2">
                <div class="font-semibold text-gray-700 mb-1">${nombreMP}</div>`;
            for (let año = 0; año < 5; año++) {
                const consumoTotal = globalData.unidadesProduccion[año] * cantidadPorUnidad;
                mpData.consumoAnual[año] = consumoTotal;
                html += `<div class="text-sm text-gray-600">Año ${año + 1}: ${consumoTotal.toLocaleString('es-MX', {minimumFractionDigits: 3})} ${unidad || 'unidad'}</div>`;
            }
            html += '</div>';
        }
    }
    html += '</div>';
    document.getElementById('consumo-mp').innerHTML = html;
    actualizarCostosMP();
    calcularComprasMP();
}

// ===========================
// PESTAÑA 8: COMPRAS MP
// ===========================
function actualizarCostosMP(materiasPrimasCargadas = null) {
    const container = document.getElementById('costos-mp-container');
    if (globalData.materiaPrima.length === 0) {
        container.innerHTML = `<h4 class="font-semibold text-gray-700 mb-3">Costos Unitarios de Materia Prima</h4><p class="text-sm text-gray-600">Configure primero las materias primas</p>`;
        calcularComprasMP();
        return;
    }
    let html = '<h4 class="font-semibold text-gray-700 mb-3">Costos Unitarios de Materia Prima</h4>';
    for (let i = 0; i < globalData.materiaPrima.length; i++) {
        const mp = globalData.materiaPrima[i];
        let costo = 0;
        if(materiasPrimasCargadas) {
            const mpCargada = materiasPrimasCargadas.find(m => m.nombre_mp === mp.nombre);
            if(mpCargada) { costo = mpCargada.costo_unitario; }
        }
        html += `
            <div class="costo-mp-item grid grid-cols-2 gap-2 mb-2">
                <span class="text-sm text-gray-700 py-2">${mp.nombre} (${mp.unidad})</span>
                <input type="number" class="costo-mp text-sm" data-index="${i}" placeholder="Costo por ${mp.unidad}" step="0.01" onchange="calcularComprasMP()" value="${costo || ''}">
            </div>
        `;
    }
    container.innerHTML = html;
    calcularComprasMP();
}

function calcularComprasMP() {
    const costosMP = document.querySelectorAll('.costo-mp');
    globalData.costoMP = [];
    globalData.comprasMP = [0,0,0,0,0];
    for (let i = 0; i < costosMP.length; i++) {
        globalData.costoMP[i] = parseFloat(costosMP[i].value) || 0;
    }
    const invInicialMP = parseFloat(document.getElementById('inv-inicial-mp').value) || 0;
    const invFinalMPPct = parseFloat(document.getElementById('inv-final-mp-pct').value) || 10;
    
    let html = '<div class="space-y-4">';
    let totalCompras = [0,0,0,0,0];
    
    for (let mpIndex = 0; mpIndex < globalData.materiaPrima.length; mpIndex++) {
        const mp = globalData.materiaPrima[mpIndex];
        const costoUnitario = globalData.costoMP[mpIndex] || 0;
        if (costoUnitario > 0) {
            html += `<div class="border-b pb-3">
                <div class="font-semibold text-gray-700 mb-2">${mp.nombre}</div>`;
            for (let año = 0; año < 5; año++) {
                const requerimiento = mp.consumoAnual[año] || 0;
                const invFinalMP = requerimiento * (invFinalMPPct / 100);
                const invInicialMPAnual = año === 0 ? invInicialMP : (mp.consumoAnual[año-1] || 0) * (invFinalMPPct / 100);
                const comprasRequeridas = requerimiento + invFinalMP - invInicialMPAnual;
                const costoCompras = Math.max(0, comprasRequeridas) * costoUnitario;
                totalCompras[año] += costoCompras;
                html += `<div class="text-sm text-gray-600">Año ${año + 1}: ${costoCompras.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>`;
            }
            html += '</div>';
        }
    }
    html += '<div class="font-bold text-lg text-indigo-600 mt-4">Total de Compras por Año:</div>';
    for (let año = 0; año < 5; año++) {
        html += `<div class="flex justify-between text-lg"><span>Año ${año + 1}:</span><span class="font-bold">${totalCompras[año].toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>`;
    }
    html += '</div>';
    globalData.comprasMP = totalCompras;
    document.getElementById('compras-mp-resultado').innerHTML = html;
    calcularCostoProduccion();
    calcularCondicionesComerciales();
}

// ===========================
// PESTAÑA 10: MANO DE OBRA
// ===========================
function calcularPptoMO() {
    const tiempoPorUnidad = parseFloat(document.getElementById('tiempo-unidad').value) || 0;
    const costoPorHora = parseFloat(document.getElementById('costo-hora').value) || 0;
    let html = '<div class="space-y-2">';
    for (let i = 0; i < 5; i++) {
        const unidadesProducir = globalData.unidadesProduccion[i] || 0;
        const horasRequeridas = unidadesProducir * tiempoPorUnidad;
        const costoMO = horasRequeridas * costoPorHora;
        globalData.costoMO[i] = costoMO;
        html += `<div class="flex justify-between border-b pb-2"><div><div class="font-medium">Año ${i + 1}</div><div class="text-sm text-gray-600">${horasRequeridas.toLocaleString('es-MX', {minimumFractionDigits: 1})} horas</div></div><div class="text-right"><div class="text-lg font-semibold text-blue-600">${costoMO.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div></div></div>`;
    }
    html += '</div>';
    document.getElementById('costo-mo').innerHTML = html;
    calcularCostoProduccion();
}

// ===========================
// PESTAÑA 11: GASTOS INDIRECTOS
// ===========================
function agregarGastoFijo(gasto = null) {
    // --- CORRECCIÓN: USAMOS EL ID NUEVO QUE PUSIMOS EN HTML ---
    const container = document.getElementById('gastos-fijos-container'); 
    const newRow = document.createElement('div');
    newRow.className = 'gasto-fijo-item grid grid-cols-2 gap-2 mt-2';
    
    const concepto = gasto ? gasto.concepto : '';
    const monto = gasto ? gasto.monto_anual : '';

    newRow.innerHTML = `
        <input type="text" placeholder="Concepto" class="gasto-fijo-concepto text-sm" value="${concepto || ''}">
        <input type="number" placeholder="Monto anual" class="gasto-fijo-monto text-sm" step="0.01" onchange="calcularGastosIndirectos()" value="${monto || ''}">
    `;
    container.appendChild(newRow);
}

function agregarGastoVariable(gasto = null) {
    // --- CORRECCIÓN: USAMOS EL ID NUEVO QUE PUSIMOS EN HTML ---
    const container = document.getElementById('gastos-variables-container');
    const newRow = document.createElement('div');
    newRow.className = 'gasto-var-item grid grid-cols-3 gap-2 mt-2';

    const concepto = gasto ? gasto.concepto : '';
    const porUnidad = gasto ? gasto.por_unidad : '';
    const unidad = gasto ? gasto.unidad : '';

    newRow.innerHTML = `
        <input type="text" placeholder="Concepto" class="gasto-var-concepto text-sm" value="${concepto || ''}">
        <input type="number" placeholder="Por unidad" class="gasto-var-unidad text-sm" step="0.001" onchange="calcularGastosIndirectos()" value="${porUnidad || ''}">
        <input type="text" placeholder="Unidad" class="gasto-var-tipo text-sm" value="${unidad || ''}">
    `;
    container.appendChild(newRow);
}

function calcularGastosIndirectos() {
    const gastosFijos = document.querySelectorAll('.gasto-fijo-monto');
    const gastosVariables = document.querySelectorAll('.gasto-var-unidad');
    const inflacion = parseFloat(document.getElementById('inflacion-anual').value) || 0;
    let html = '<div class="space-y-3">';
    
    for (let año = 0; año < 5; año++) {
        let totalFijos = 0;
        gastosFijos.forEach(input => {
            const monto = parseFloat(input.value) || 0;
            totalFijos += monto * Math.pow(1 + inflacion/100, año);
        });
        
        let totalVariables = 0;
        gastosVariables.forEach(input => {
            const costoPorUnidad = parseFloat(input.value) || 0;
            totalVariables += costoPorUnidad * (globalData.unidadesProduccion[año] || 0);
        });
        
        const totalGastosIndirectos = totalFijos + totalVariables;
        globalData.gastosIndirectos[año] = totalGastosIndirectos;
        
        html += `<div class="flex justify-between border-b pb-2"><div><div class="font-medium">Año ${año + 1}</div><div class="text-xs text-gray-500">Fijos: ${totalFijos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div><div class="text-xs text-gray-500">Variables: ${totalVariables.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div></div><div class="text-lg font-semibold text-purple-600">${totalGastosIndirectos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div></div>`;
    }
    html += '</div>';
    document.getElementById('gastos-indirectos-resultado').innerHTML = html;
    calcularCostoProduccion();
}

// ===========================
// PESTAÑA 12: COSTO VENDIDO
// ===========================
function calcularCostoProduccion() {
    let html = '<div class="space-y-2">';
    let htmlVendido = '<div class="space-y-2">';
    const invInicialPT = parseFloat(document.getElementById('inv-inicial-pt').value) || 0;
    
    for (let año = 0; año < 5; año++) {
        const costoMP = globalData.comprasMP[año] || 0;
        const costoMO = globalData.costoMO[año] || 0;
        const gastosInd = globalData.gastosIndirectos[año] || 0;
        
        const costoProduccionTotal = costoMP + costoMO + gastosInd;
        globalData.costoProduccion[año] = costoProduccionTotal;
        
        const unidadesProducidas = globalData.unidadesProduccion[año] || 0;
        const costoUnitario = unidadesProducidas > 0 ? costoProduccionTotal / unidadesProducidas : 0;
        globalData.costoUnitarioProduccion[año] = costoUnitario;
        
        if (año === 0) {
            document.getElementById('costo-unitario-pt').value = costoUnitario.toFixed(2);
        }
        
        const invFinalPT = parseFloat(document.getElementById(`inv-final-${año + 1}`).value) || 0;
        const invInicialPTAnual = año === 0 ? invInicialPT * costoUnitario : parseFloat(document.getElementById(`inv-final-${año}`).value) * costoUnitario;
        const costoVendido = invInicialPTAnual + costoProduccionTotal - (invFinalPT * costoUnitario);
        globalData.costoVendido[año] = Math.max(0, costoVendido);
        
        html += `<div class="flex justify-between border-b pb-2"><div><div class="font-medium">Año ${año + 1}</div><div class="text-xs text-gray-500">MP: ${costoMP.toLocaleString('es-MX')}</div><div class="text-xs text-gray-500">MO: ${costoMO.toLocaleString('es-MX')}</div><div class="text-xs text-gray-500">GI: ${gastosInd.toLocaleString('es-MX')}</div></div><div class="text-lg font-semibold text-green-600">${costoProduccionTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div></div>`;
        htmlVendido += `<div class="flex justify-between border-b pb-2"><span class="font-medium">Año ${año + 1}</span><span class="text-lg font-semibold text-red-600">${costoVendido.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>`;
    }
    html += '</div>';
    htmlVendido += '</div>';
    document.getElementById('costo-produccion-anual').innerHTML = html;
    document.getElementById('costo-vendido-anual').innerHTML = htmlVendido;
    calcularEstadoResultados();
    calcularValuacionInv();
}

// ===========================
// PESTAÑA 13: GASTOS OPERACIÓN
// ===========================
function agregarGastoAdmin(gasto = null) {
    const container = document.getElementById('gastos-admin-container');
    const newRow = document.createElement('div');
    newRow.className = 'gasto-admin-item grid grid-cols-2 gap-2 mb-2';
    const concepto = gasto ? gasto.concepto : '';
    const monto = gasto ? gasto.monto_mensual : '';
    newRow.innerHTML = `<input type="text" placeholder="Concepto" class="gasto-admin-concepto text-sm" value="${concepto || ''}"><input type="number" placeholder="Monto mensual" class="gasto-admin-monto text-sm" step="0.01" onchange="calcularGastosOperacion()" value="${monto || ''}">`;
    container.appendChild(newRow);
}

function agregarGastoVentas(gasto = null) {
    const container = document.getElementById('gastos-ventas-container');
    const newRow = document.createElement('div');
    newRow.className = 'gasto-ventas-item grid grid-cols-2 gap-2 mb-2';
    const concepto = gasto ? gasto.concepto : '';
    const porcentaje = gasto ? gasto.porcentaje_sobre_ventas : '';
    newRow.innerHTML = `<input type="text" placeholder="Concepto" class="gasto-ventas-concepto text-sm" value="${concepto || ''}"><input type="number" placeholder="% de ventas" class="gasto-ventas-pct text-sm" step="0.1" onchange="calcularGastosOperacion()" value="${porcentaje || ''}">`;
    container.appendChild(newRow);
}

function calcularGastosOperacion() {
    const gastosAdmin = document.querySelectorAll('.gasto-admin-monto');
    const gastosVentas = document.querySelectorAll('.gasto-ventas-pct');
    let html = '<div class="space-y-2">';
    for (let año = 0; año < 5; año++) {
        let totalAdmin = 0;
        gastosAdmin.forEach(input => { totalAdmin += (parseFloat(input.value) || 0) * 12; });
        let totalVentas = 0;
        const ventasAnuales = globalData.ventasProyeccion[año] || 0;
        gastosVentas.forEach(input => { totalVentas += ventasAnuales * (parseFloat(input.value) || 0) / 100; });
        const totalGastosOp = totalAdmin + totalVentas;
        globalData.gastosOperacion[año] = totalGastosOp;
        html += `<div class="flex justify-between border-b pb-2"><div><div class="font-medium">Año ${año + 1}</div><div class="text-xs text-gray-500">Admin: ${totalAdmin.toLocaleString('es-MX')}</div><div class="text-xs text-gray-500">Ventas: ${totalVentas.toLocaleString('es-MX')}</div></div><div class="text-lg font-semibold text-orange-600">${totalGastosOp.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div></div>`;
    }
    html += '</div>';
    document.getElementById('gastos-operacion-resultado').innerHTML = html;
    calcularEstadoResultados();
}

// ===========================
// PESTAÑA 9: VALUACIÓN INV.
// ===========================
function calcularValuacionInv() {
    const invFinalMPPct = parseFloat(document.getElementById('inv-final-mp-pct').value) || 10;
    let html_mp = '<div class="space-y-4" style="max-height: 400px; overflow-y: auto;">';
    let html_pt = '<div class="space-y-4">';
    let totalValuacionMP = [0,0,0,0,0];

    for (let mpIndex = 0; mpIndex < globalData.materiaPrima.length; mpIndex++) {
        const mp = globalData.materiaPrima[mpIndex];
        const costoUnitario = globalData.costoMP[mpIndex] || 0;
        html_mp += `<div class="border-b pb-3"><div class="font-semibold text-gray-700 mb-2">${mp.nombre}</div>`;
        for (let año = 0; año < 5; año++) {
            const requerimiento = mp.consumoAnual[año] || 0;
            const invFinalUnidades = requerimiento * (invFinalMPPct / 100);
            const valorInventario = invFinalUnidades * costoUnitario;
            totalValuacionMP[año] += valorInventario;
            html_mp += `<div class="text-sm text-gray-600">Año ${año + 1}: ${invFinalUnidades.toLocaleString('es-MX', {minimumFractionDigits: 2})} ${mp.unidad} × $${costoUnitario.toLocaleString('es-MX')} = $${valorInventario.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>`;
        }
        html_mp += '</div>';
    }
    html_mp += '<div class="font-bold text-lg text-indigo-600 mt-4">Total Valuación MP:</div>';
    for (let año = 0; año < 5; año++) {
        html_mp += `<div class="flex justify-between text-lg"><span>Año ${año + 1}:</span><span class="font-bold">$${totalValuacionMP[año].toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>`;
    }
    html_mp += '</div>';
    document.getElementById('valuacion-mp').innerHTML = html_mp;

    html_pt += '<div class="font-bold text-lg text-green-600 mt-4">Total Valuación PT:</div>';
    for (let año = 0; año < 5; año++) {
        const invFinalUnidades = parseFloat(document.getElementById(`inv-final-${año + 1}`).value) || 0;
        const costoUnitario = globalData.costoUnitarioProduccion[año] || 0;
        const valorInventario = invFinalUnidades * costoUnitario;
        html_pt += `<div class="flex justify-between text-lg border-b pb-2"><span>Año ${año + 1}:</span><span class="font-bold">$${valorInventario.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>`;
        html_pt += `<div class="text-sm text-gray-600">${invFinalUnidades.toLocaleString('es-MX')} unidades × $${costoUnitario.toLocaleString('es-MX', {minimumFractionDigits: 2})} c/u</div>`;
    }
    html_pt += '</div>';
    document.getElementById('valuacion-pt').innerHTML = html_pt;
}

// ===========================
// PESTAÑA 14: ESTADO DE RESULTADOS
// ===========================
function calcularEstadoResultados() {
    let html = '<div class="overflow-x-auto"><table class="min-w-full text-sm">';
    html += '<thead class="table-header"><tr><th class="px-3 py-2">Concepto</th>';
    for (let año = 1; año <= 5; año++) { html += `<th class="px-3 py-2">Año ${año}</th>`; }
    html += '</tr></thead><tbody>';
    
    html += '<tr class="table-row bg-green-50"><td class="px-3 py-2 font-bold">INGRESOS</td>';
    for (let año = 0; año < 5; año++) { html += `<td class="px-3 py-2 font-semibold text-green-600">$${(globalData.ventasProyeccion[año] || 0).toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`; }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">(-) Costo de lo Vendido</td>';
    for (let año = 0; año < 5; año++) { html += `<td class="px-3 py-2 text-red-600">$${(globalData.costoVendido[año] || 0).toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`; }
    html += '</tr>';
    
    html += '<tr class="table-row bg-blue-50"><td class="px-3 py-2 font-bold">UTILIDAD BRUTA</td>';
    let utilidadBruta = [];
    for (let año = 0; año < 5; año++) {
        const ub = (globalData.ventasProyeccion[año] || 0) - (globalData.costoVendido[año] || 0);
        utilidadBruta[año] = ub;
        html += `<td class="px-3 py-2 font-semibold">$${ub.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">(-) Gastos de Operación</td>';
    for (let año = 0; año < 5; año++) { html += `<td class="px-3 py-2 text-red-600">$${(globalData.gastosOperacion[año] || 0).toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`; }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">(-) Depreciación</td>';
    for (let año = 0; año < 5; año++) { html += `<td class="px-3 py-2 text-red-600">$${(globalData.depreciacion[año] || 0).toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`; }
    html += '</tr>';
    
    html += '<tr class="table-row bg-yellow-50"><td class="px-3 py-2 font-bold">UTILIDAD DE OPERACIÓN</td>';
    let utilidadOperacion = [];
    for (let año = 0; año < 5; año++) {
        const uo = utilidadBruta[año] - (globalData.gastosOperacion[año] || 0) - (globalData.depreciacion[año] || 0);
        utilidadOperacion[año] = uo;
        html += `<td class="px-3 py-2 font-semibold">$${uo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">(-) ISR (30%)</td>';
    for (let año = 0; año < 5; año++) {
        const isr = Math.max(0, utilidadOperacion[año] * 0.30);
        html += `<td class="px-3 py-2 text-red-600">$${isr.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row bg-green-100"><td class="px-3 py-2 font-bold">UTILIDAD NETA</td>';
    for (let año = 0; año < 5; año++) {
        const isr = Math.max(0, utilidadOperacion[año] * 0.30);
        const un = utilidadOperacion[año] - isr;
        globalData.utilidadNeta[año] = un;
        const colorClass = un >= 0 ? 'text-green-700' : 'text-red-700';
        html += `<td class="px-3 py-2 font-bold ${colorClass}">$${un.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    html += '</tbody></table></div>';
    document.getElementById('estado-resultados').innerHTML = html;
    calcularEstadoSituacion();
}

// ===========================
// PESTAÑA 15: BALANCE
// ===========================
function calcularEstadoSituacion() {
    const inversionInicial = parseFloat(document.getElementById('inversion-inicial').value) || 0;
    let html = '<div class="overflow-x-auto"><table class="min-w-full text-sm">';
    html += '<thead class="table-header"><tr><th class="px-3 py-2">Concepto</th>';
    for (let año = 1; año <= 5; año++) { html += `<th class="px-3 py-2">Año ${año}</th>`; }
    html += '</tr></thead><tbody>';
    
    html += '<tr class="bg-blue-100"><td colspan="6" class="px-3 py-2 font-bold">ACTIVOS</td></tr>';
    html += '<tr class="table-row"><td class="px-3 py-2">Efectivo</td>';
    for (let año = 0; año < 5; año++) {
        const efectivo = (globalData.utilidadNeta[año] || 0) * 0.3;
        html += `<td class="px-3 py-2">$${efectivo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">Cuentas por Cobrar</td>';
    for (let año = 0; año < 5; año++) {
        const cxc = (globalData.ventasProyeccion[año] || 0) * (globalData.diasCredito.ventas / 360);
        html += `<td class="px-3 py-2">$${cxc.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">Activo Fijo Neto</td>';
    for (let año = 0; año < 5; año++) {
        let totalInversion = globalData.inversionesActivo.reduce((sum, inv) => sum + inv.monto, 0);
        let depreciacionAcum = 0;
        for (let a = 0; a <= año; a++) { depreciacionAcum += (globalData.depreciacion[a] || 0); }
        const activoNeto = totalInversion - depreciacionAcum;
        html += `<td class="px-3 py-2">$${Math.max(0, activoNeto).toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="bg-red-100"><td colspan="6" class="px-3 py-2 font-bold">PASIVOS</td></tr>';
    html += '<tr class="table-row"><td class="px-3 py-2">Cuentas por Pagar</td>';
    for (let año = 0; año < 5; año++) {
        const cxp = (globalData.comprasMP[año] || 0) * (globalData.diasCredito.compras / 360);
        html += `<td class="px-3 py-2">$${cxp.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="bg-green-100"><td colspan="6" class="px-3 py-2 font-bold">CAPITAL CONTABLE</td></tr>';
    html += '<tr class="table-row"><td class="px-3 py-2">Capital Social</td>';
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2">$${inversionInicial.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">Utilidades Retenidas</td>';
    let utilidadAcum = 0;
    for (let año = 0; año < 5; año++) {
        utilidadAcum += (globalData.utilidadNeta[año] || 0);
        html += `<td class="px-3 py-2">$${utilidadAcum.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    html += '</tbody></table></div>';
    document.getElementById('estado-situacion').innerHTML = html;
}

// ===========================
// PESTAÑA 16: FLUJO EFECTIVO
// ===========================
function calcularFlujoEfectivo() {
    const inversionInicial = parseFloat(document.getElementById('inversion-inicial').value) || 0;
    const saldoInicial = parseFloat(document.getElementById('saldo-inicial').value) || 0;
    const pctCobroEfectivo = parseFloat(document.getElementById('pct-cobro-efectivo').value) || 80;
    let html = '<div class="overflow-x-auto"><table class="min-w-full text-sm"><thead class="table-header"><tr><th class="px-3 py-2">Concepto</th>';
    for (let año = 1; año <= 5; año++) { html += `<th class="px-3 py-2">Año ${año}</th>`; }
    html += '</tr></thead><tbody>';
    
    html += '<tr class="table-row"><td class="px-3 py-2 font-semibold">INGRESOS</td>';
    let ingresosPorAño = [];
    for (let año = 0; año < 5; año++) {
        const ventasEfectivo = (globalData.ventasProyeccion[año] || 0) * (pctCobroEfectivo / 100);
        ingresosPorAño[año] = ventasEfectivo;
        html += `<td class="px-3 py-2 text-green-600 font-semibold">${ventasEfectivo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2 font-semibold">EGRESOS</td>';
    let egresosPorAño = [];
    for (let año = 0; año < 5; año++) {
        const egresos = (globalData.comprasMP[año] || 0) + (globalData.costoMO[año] || 0) + (globalData.gastosIndirectos[año] || 0) + (globalData.gastosOperacion[año] || 0);
        egresosPorAño[año] = egresos;
        html += `<td class="px-3 py-2 text-red-600 font-semibold">${egresos.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row bg-blue-50"><td class="px-3 py-2 font-bold">FLUJO NETO</td>';
    let flujoNeto = [];
    for (let año = 0; año < 5; año++) {
        const flujo = ingresosPorAño[año] - egresosPorAño[año];
        flujoNeto[año] = flujo;
        const colorClass = flujo >= 0 ? 'text-green-700' : 'text-red-700';
        html += `<td class="px-3 py-2 font-bold ${colorClass}">${flujo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">Saldo Inicial</td>';
    let saldoAnterior = saldoInicial - inversionInicial;
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2">${saldoAnterior.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
        saldoAnterior += flujoNeto[año];
    }
    html += '</tr>';
    
    html += '<tr class="table-row bg-yellow-50"><td class="px-3 py-2 font-bold">SALDO FINAL</td>';
    saldoAnterior = saldoInicial - inversionInicial;
    for (let año = 0; año < 5; año++) {
        saldoAnterior += flujoNeto[año];
        const colorClass = saldoAnterior >= 0 ? 'text-green-700' : 'text-red-700';
        html += `<td class="px-3 py-2 font-bold ${colorClass}">${saldoAnterior.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    html += '</tbody></table></div>';
    document.getElementById('flujo-efectivo-resultado').innerHTML = html;
    generarResumenEjecutivo();
}

function generarResumenEjecutivo() {
    const inversionInicial = parseFloat(document.getElementById('inversion-inicial').value) || 0;
    const ventasTotal = (globalData.ventasProyeccion || []).reduce((a, b) => a + b, 0);
    const utilidadBruta5Años = (globalData.ventasProyeccion || []).reduce((total, venta, index) => {
        return total + venta - (globalData.costoVendido[index] || 0);
    }, 0);
    const utilidadNeta5Años = (globalData.utilidadNeta || []).reduce((a, b) => a + b, 0);
    const margenPromedio = ventasTotal > 0 ? (utilidadBruta5Años / ventasTotal * 100) : 0;
    const roiProyectado = inversionInicial > 0 ? (utilidadNeta5Años / inversionInicial * 100) : 0;
    
    let html = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-green-100 p-3 rounded-lg text-center"><div class="text-2xl font-bold text-green-700">${ventasTotal.toLocaleString('es-MX', {minimumFractionDigits: 0})}</div><div class="text-sm text-green-600">Ingresos Totales (5 años)</div></div>
            <div class="bg-blue-100 p-3 rounded-lg text-center"><div class="text-2xl font-bold text-blue-700">${utilidadNeta5Años.toLocaleString('es-MX', {minimumFractionDigits: 0})}</div><div class="text-sm text-blue-600">Utilidad Neta (5 años)</div></div>
            <div class="bg-purple-100 p-3 rounded-lg text-center"><div class="text-2xl font-bold text-purple-700">${margenPromedio.toFixed(1)}%</div><div class="text-sm text-purple-600">Margen Bruto Promedio</div></div>
            <div class="bg-yellow-100 p-3 rounded-lg text-center"><div class="text-2xl font-bold text-yellow-700">${roiProyectado.toFixed(1)}%</div><div class="text-sm text-yellow-600">ROI Proyectado</div></div>
        </div>
        <div class="mt-4 text-sm text-gray-600">
            <p><strong>Punto de Equilibrio:</strong> Se alcanza cuando los ingresos igualan los costos totales.</p>
            <p><strong>Recomendación:</strong> ${margenPromedio > 20 ? 'Proyecto viable con buen margen de rentabilidad.' : 'Revisar costos para mejorar rentabilidad.'}</p>
            <p><strong>Análisis de Penetración:</strong> Año 1: ${(globalData.penetracionMercado[0] || 0).toFixed(1)}% → Año 5: ${(globalData.penetracionMercado[4] || 0).toFixed(1)}%</p>
        </div>
    `;
    document.getElementById('resumen-ejecutivo').innerHTML = html;
}

// ===========================
// FUNCIONES DE GUARDADO/CARGADO/EXPORT
// ===========================
function nuevoProyecto() {
    document.getElementById('id_proyecto_actual').value = '';
    document.getElementById('nombre_proyecto').value = '';
    const formulario = document.querySelector('main');
    const inputs = formulario.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => { if (input.id !== 'nombre_proyecto' && input.id !== 'id_proyecto_actual') { input.value = ''; } });
    
    document.getElementById('inversiones-container').innerHTML = '';
    document.getElementById('receta-container').innerHTML = '';
    document.getElementById('costos-mp-container').innerHTML = '';
    document.getElementById('gastos-admin-container').innerHTML = '';
    document.getElementById('gastos-ventas-container').innerHTML = '';
    // --- CORRECCIÓN: LIMPIAR LOS CONTENEDORES DE GASTOS INDIRECTOS ---
    document.getElementById('gastos-fijos-container').innerHTML = ''; 
    document.getElementById('gastos-variables-container').innerHTML = '';
    
    Object.keys(globalData).forEach(k => { if (Array.isArray(globalData[k])) { globalData[k] = []; } else if (typeof globalData[k] === 'object' && globalData[k] !== null) { globalData[k] = {}; } else { globalData[k] = 0; } });
    
    agregarInversion();
    agregarMateriaPrima();
    agregarGastoAdmin();
    agregarGastoVentas();
    // --- CORRECCIÓN: AGREGAR FILAS VACÍAS ---
    agregarGastoFijo();
    agregarGastoVariable();

    calcularPlan();
    calcularFactSensibil();
    calcularPptoVtas();
    calcularInversiones();
    calcularGastosOperacion();
    calcularFlujoEfectivo();
    console.log('Formulario limpiado.');
}

function guardarProyecto() {
    console.log("Iniciando el proceso de guardado...");
    const datosDelProyecto = {
        id_proyecto: document.getElementById('id_proyecto_actual').value,
        nombre_proyecto: document.getElementById('nombre_proyecto').value || "Proyecto sin nombre",
        poblacion_total: document.getElementById('poblacion-total').value,
        pct_mujeres: document.getElementById('porcentaje-mujeres').value,
        pct_rango_edad: document.getElementById('rango-edad').value,
        pct_poblacion_ocupada: document.getElementById('poblacion-ocupada').value,
        pct_concentracion_mercado: document.getElementById('concentracion-mercado').value,
        participacion_mercado: document.getElementById('participacion-mercado').value,
        incremento_poblacion: document.getElementById('incremento-poblacion').value,
        incremento_producto: document.getElementById('incremento-producto').value,
        penetracion_inicial: document.getElementById('penetracion-inicial').value,
        incremento_penetracion: document.getElementById('incremento-penetracion').value,
        precio_unitario_base: document.getElementById('precio-unitario-base').value,
        incremento_precio: document.getElementById('incremento-precio').value,
        unidades_venta_a1: document.getElementById('unidades-1').value,
        unidades_venta_a2: document.getElementById('unidades-2').value,
        unidades_venta_a3: document.getElementById('unidades-3').value,
        unidades_venta_a4: document.getElementById('unidades-4').value,
        unidades_venta_a5: document.getElementById('unidades-5').value,
        dias_credito_ventas: document.getElementById('dias-credito-ventas').value,
        dias_credito_compras: document.getElementById('dias-credito-compras').value,
        descuento_pronto_pago: document.getElementById('descuento-pronto-pago').value,
        inv_inicial_prod: document.getElementById('inv-inicial-prod').value,
        inv_final_a1: document.getElementById('inv-final-1').value,
        inv_final_a2: document.getElementById('inv-final-2').value,
        inv_final_a3: document.getElementById('inv-final-3').value,
        inv_final_a4: document.getElementById('inv-final-4').value,
        inv_final_a5: document.getElementById('inv-final-5').value,
        inv_inicial_mp: document.getElementById('inv-inicial-mp').value,
        inv_final_mp_pct: document.getElementById('inv-final-mp-pct').value,
        tiempo_unidad_mo: document.getElementById('tiempo-unidad').value,
        costo_hora_mo: document.getElementById('costo-hora').value,
        inversion_inicial: document.getElementById('inversion-inicial').value,
        inflacion_anual: document.getElementById('inflacion-anual').value
    };

    const inversiones = [];
    document.querySelectorAll('#inversiones-container .inversion-item').forEach(fila => {
        const nombre = fila.querySelector('.inv-nombre').value;
        const monto = fila.querySelector('.inv-monto').value;
        const vida = fila.querySelector('.inv-vida').value;
        const tipo = fila.querySelector('.inv-tipo').value;
        if (nombre && monto && vida) { inversiones.push({ nombre, monto, vida_util: vida, tipo }); }
    });
    datosDelProyecto.inversiones = inversiones;

    const materiasPrimas = [];
    const filasMP = document.querySelectorAll('#receta-container .mp-item');
    const costosMP = document.querySelectorAll('#costos-mp-container .costo-mp-item');
    filasMP.forEach((fila, index) => {
        const nombre = fila.querySelector('.receta-mp').value;
        const cantidad = fila.querySelector('.receta-cant').value;
        const unidad = fila.querySelector('.receta-unidad').value;
        let costo = 0;
        if (costosMP[index]) { costo = costosMP[index].querySelector('.costo-mp').value; }
        if (nombre && cantidad) { materiasPrimas.push({ nombre, cantidad, unidad, costo_unitario: costo }); }
    });
    datosDelProyecto.materias_primas = materiasPrimas;

    const gastosAdmin = [];
    document.querySelectorAll('#gastos-admin-container .gasto-admin-item').forEach(fila => {
        const concepto = fila.querySelector('.gasto-admin-concepto').value;
        const monto = fila.querySelector('.gasto-admin-monto').value;
        if (concepto && monto) { gastosAdmin.push({ concepto, monto_mensual: monto }); }
    });
    datosDelProyecto.gastos_admin = gastosAdmin;

    const gastosVentas = [];
    document.querySelectorAll('#gastos-ventas-container .gasto-ventas-item').forEach(fila => {
        const concepto = fila.querySelector('.gasto-ventas-concepto').value;
        const porcentaje = fila.querySelector('.gasto-ventas-pct').value;
        if (concepto && porcentaje) { gastosVentas.push({ concepto, porcentaje_sobre_ventas: porcentaje }); }
    });
    datosDelProyecto.gastos_ventas = gastosVentas;

    // --- RECOLECCIÓN DE GASTOS INDIRECTOS ---
    const gastosFijos = [];
    document.querySelectorAll('#gastos-fijos-container .gasto-fijo-item').forEach(fila => {
        const concepto = fila.querySelector('.gasto-fijo-concepto').value;
        const monto = fila.querySelector('.gasto-fijo-monto').value;
        if (concepto && monto) { gastosFijos.push({ concepto, monto_anual: monto }); }
    });
    datosDelProyecto.gastos_fijos = gastosFijos;

    const gastosVariables = [];
    document.querySelectorAll('#gastos-variables-container .gasto-var-item').forEach(fila => {
        const concepto = fila.querySelector('.gasto-var-concepto').value;
        const porUnidad = fila.querySelector('.gasto-var-unidad').value;
        const unidad = fila.querySelector('.gasto-var-tipo').value;
        if (concepto && porUnidad) { gastosVariables.push({ concepto, por_unidad: porUnidad, unidad }); }
    });
    datosDelProyecto.gastos_variables = gastosVariables;

    console.log("Datos que se enviarán al servidor:", datosDelProyecto);

    fetch('api/guardar_proyecto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosDelProyecto)
    })
    .then(response => {
        if (!response.ok) { throw new Error(`Error del servidor: ${response.status}`); }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if(data.status === 'success' && data.id_proyecto) { document.getElementById('id_proyecto_actual').value = data.id_proyecto; }
        alert(data.message || '¡Acción completada!');
        cargarListaDeProyectos();
    })
    .catch(error => {
        console.error('Error al intentar guardar:', error);
        alert('Hubo un error al guardar. Revisa la consola.');
    });
}

function cargarListaDeProyectos() {
    fetch('api/cargar_proyectos.php')
        .then(response => {
            if (!response.ok) { throw new Error(`Error del servidor: ${response.status}`); }
            return response.json();
        })
        .then(proyectos => {
            const lista = document.getElementById('lista-proyectos');
            lista.innerHTML = '';
            if (proyectos.length === 0) { lista.innerHTML = '<li>No hay proyectos guardados.</li>'; } else {
                proyectos.forEach(proyecto => {
                    lista.innerHTML += `<li><a href="#" class="text-blue-600 hover:underline" onclick="cargarProyecto(${proyecto.id_proyecto}); return false;">${proyecto.nombre_proyecto}</a></li>`;
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar la lista de proyectos:', error);
            document.getElementById('lista-proyectos').innerHTML = '<li>Error al cargar proyectos.</li>';
        });
}

function cargarProyecto(id) {
    console.log(`Cargando datos para el proyecto con ID: ${id}`);
    fetch(`api/obtener_proyecto.php?id=${id}`)
        .then(response => {
             if (!response.ok) { throw new Error(`Error del servidor: ${response.status}`); }
            return response.json();
        })
        .then(datos => {
            if(datos.error) { throw new Error(datos.error); }
            
            nuevoProyecto();

            document.getElementById('id_proyecto_actual').value = datos.id_proyecto;
            document.getElementById('nombre_proyecto').value = datos.nombre_proyecto;
            document.getElementById('poblacion-total').value = datos.poblacion_total;
            document.getElementById('porcentaje-mujeres').value = datos.pct_mujeres;
            document.getElementById('rango-edad').value = datos.pct_rango_edad;
            document.getElementById('poblacion-ocupada').value = datos.pct_poblacion_ocupada;
            document.getElementById('concentracion-mercado').value = datos.pct_concentracion_mercado;
            document.getElementById('participacion-mercado').value = datos.participacion_mercado;
            document.getElementById('incremento-poblacion').value = datos.incremento_poblacion;
            document.getElementById('incremento-producto').value = datos.incremento_producto;
            document.getElementById('penetracion-inicial').value = datos.penetracion_inicial;
            document.getElementById('incremento-penetracion').value = datos.incremento_penetracion;
            document.getElementById('precio-unitario-base').value = datos.precio_unitario_base;
            document.getElementById('incremento-precio').value = datos.incremento_precio;
            document.getElementById('unidades-1').value = datos.unidades_venta_a1;
            document.getElementById('unidades-2').value = datos.unidades_venta_a2;
            document.getElementById('unidades-3').value = datos.unidades_venta_a3;
            document.getElementById('unidades-4').value = datos.unidades_venta_a4;
            document.getElementById('unidades-5').value = datos.unidades_venta_a5;
            document.getElementById('dias-credito-ventas').value = datos.dias_credito_ventas;
            document.getElementById('dias-credito-compras').value = datos.dias_credito_compras;
            document.getElementById('descuento-pronto-pago').value = datos.descuento_pronto_pago;
            document.getElementById('inv-inicial-prod').value = datos.inv_inicial_prod;
            document.getElementById('inv-final-1').value = datos.inv_final_a1;
            document.getElementById('inv-final-2').value = datos.inv_final_a2;
            document.getElementById('inv-final-3').value = datos.inv_final_a3;
            document.getElementById('inv-final-4').value = datos.inv_final_a4;
            document.getElementById('inv-final-5').value = datos.inv_final_a5;
            document.getElementById('inv-inicial-mp').value = datos.inv_inicial_mp;
            document.getElementById('inv-final-mp-pct').value = datos.inv_final_mp_pct;
            document.getElementById('tiempo-unidad').value = datos.tiempo_unidad_mo;
            document.getElementById('costo-hora').value = datos.costo_hora_mo;
            document.getElementById('inversion-inicial').value = datos.inversion_inicial;
            document.getElementById('inflacion-anual').value = datos.inflacion_anual;

            document.getElementById('inversiones-container').innerHTML = ''; 
            if (datos.inversiones && datos.inversiones.length > 0) { datos.inversiones.forEach(inversion => agregarInversion(inversion)); } else { agregarInversion(); }
            
            document.getElementById('receta-container').innerHTML = ''; 
            if (datos.materias_primas && datos.materias_primas.length > 0) { datos.materias_primas.forEach(mp => agregarMateriaPrima(mp)); } else { agregarMateriaPrima(); }

            document.getElementById('gastos-admin-container').innerHTML = ''; 
            if (datos.gastos_admin && datos.gastos_admin.length > 0) { datos.gastos_admin.forEach(gasto => agregarGastoAdmin(gasto)); } else { agregarGastoAdmin(); }
            
            document.getElementById('gastos-ventas-container').innerHTML = ''; 
            if (datos.gastos_ventas && datos.gastos_ventas.length > 0) { datos.gastos_ventas.forEach(gasto => agregarGastoVentas(gasto)); } else { agregarGastoVentas(); }

            // --- CORRECCIÓN: CARGAR GASTOS INDIRECTOS ---
            document.getElementById('gastos-fijos-container').innerHTML = ''; 
            if (datos.gastos_fijos && datos.gastos_fijos.length > 0) { datos.gastos_fijos.forEach(gasto => agregarGastoFijo(gasto)); } else { agregarGastoFijo(); }

            document.getElementById('gastos-variables-container').innerHTML = ''; 
            if (datos.gastos_variables && datos.gastos_variables.length > 0) { datos.gastos_variables.forEach(gasto => agregarGastoVariable(gasto)); } else { agregarGastoVariable(); }

            calcularPlan();
            calcularFactSensibil();
            calcularPptoVtas(); 
            actualizarCostosMP(datos.materias_primas);
            calcularComprasMP(); 
            calcularInversiones();
            calcularGastosIndirectos(); 
            calcularGastosOperacion();
            calcularFlujoEfectivo();

            alert(`Proyecto "${datos.nombre_proyecto}" cargado correctamente.`);
        })
        .catch(error => {
            console.error('Error al cargar el proyecto:', error);
            alert('No se pudo cargar la información del proyecto.');
        });
}

function exportarDatos() {
    const data = { timestamp: new Date().toISOString(), globalData: globalData, inputs: {} };
    document.querySelectorAll('input, select').forEach(input => {
        if (input.id || input.className) {
            const key = input.id || `${input.className}_${input.dataset.index || ''}`;
            data.inputs[key] = input.value;
        }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analisis_financiero_completo_' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Datos exportados exitosamente');
}

function imprimirReporte() { window.print(); }

function checkMobile() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.nav-button').forEach(btn => { btn.classList.add('text-xs', 'px-2', 'py-1'); btn.classList.remove('px-3', 'py-2'); });
    } else {
        document.querySelectorAll('.nav-button').forEach(btn => { btn.classList.remove('text-xs', 'px-2', 'py-1'); btn.classList.add('px-3', 'py-2'); });
    }
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'p': e.preventDefault(); imprimirReporte(); break;
            case 's': e.preventDefault(); guardarProyecto(); break;
        }
    }
});

window.addEventListener('resize', checkMobile);

document.addEventListener('DOMContentLoaded', function() {
    checkMobile();
    cargarListaDeProyectos(); 
    document.getElementById('poblacion-total').addEventListener('change', calcularPlan);
    document.getElementById('porcentaje-mujeres').addEventListener('change', calcularPlan);
    document.getElementById('rango-edad').addEventListener('change', calcularPlan);
    document.getElementById('poblacion-ocupada').addEventListener('change', calcularPlan);
    document.getElementById('concentracion-mercado').addEventListener('change', calcularPlan);
    console.log('Sistema de Análisis Financiero v2.3 FINAL Cargado y Limpio');
});