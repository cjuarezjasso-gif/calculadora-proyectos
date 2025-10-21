// [Continúa con las demás funciones originales...]
// Por brevedad, incluyo solo las principales modificaciones

// ===========================
// FUNCIONES ORIGINALES MANTENIDAS
// ===========================

function agregarMateriaPrima() {
    const container = document.getElementById('receta-container');
    const newRow = document.createElement('div');
    newRow.className = 'grid grid-cols-3 gap-2 mb-2';
    newRow.innerHTML = `
        <input type="text" placeholder="Materia Prima" class="receta-mp text-sm" onchange="calcularPptoMtp()">
        <input type="number" placeholder="Cantidad por unidad" class="receta-cant text-sm" step="0.001" onchange="calcularPptoMtp()">
        <input type="text" placeholder="Unidad" class="receta-unidad text-sm">
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
    
    if (globalData.materiaPrima.length === 0) {
        html += '<p class="text-gray-500">Agregue materias primas para ver el consumo</p>';
    }
    
    html += '</div>';
    document.getElementById('consumo-mp').innerHTML = html;
    actualizarCostosMP();
    calcularComprasMP();
}

function actualizarCostosMP() {
    const container = document.getElementById('costos-mp-container');
    if (globalData.materiaPrima.length === 0) {
        container.innerHTML = `
            <h4 class="font-semibold text-gray-700 mb-3">Costos Unitarios de Materia Prima</h4>
            <p class="text-sm text-gray-600">Configure primero las materias primas</p>
        `;
        return;
    }
    
    let html = '<h4 class="font-semibold text-gray-700 mb-3">Costos Unitarios de Materia Prima</h4>';
    
    for (let i = 0; i < globalData.materiaPrima.length; i++) {
        const mp = globalData.materiaPrima[i];
        html += `
            <div class="grid grid-cols-2 gap-2 mb-2">
                <span class="text-sm text-gray-700 py-2">${mp.nombre} (${mp.unidad})</span>
                <input type="number" class="costo-mp text-sm" data-index="${i}" placeholder="Costo por ${mp.unidad}" step="0.01" onchange="calcularComprasMP()">
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function calcularComprasMP() {
    const costosMP = document.querySelectorAll('.costo-mp');
    globalData.costoMP = [];
    globalData.comprasMP = [];
    
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
        html += `<div class="flex justify-between text-lg">
            <span>Año ${año + 1}:</span>
            <span class="font-bold">${totalCompras[año].toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
        </div>`;
    }
    
    html += '</div>';
    globalData.comprasMP = totalCompras;
    document.getElementById('compras-mp-resultado').innerHTML = html;
    calcularCostoProduccion();
}

function calcularPptoMO() {
    const tiempoPorUnidad = parseFloat(document.getElementById('tiempo-unidad').value) || 0;
    const costoPorHora = parseFloat(document.getElementById('costo-hora').value) || 0;
    
    let html = '<div class="space-y-2">';
    
    for (let i = 0; i < 5; i++) {
        const unidadesProducir = globalData.unidadesProduccion[i] || 0;
        const horasRequeridas = unidadesProducir * tiempoPorUnidad;
        const costoMO = horasRequeridas * costoPorHora;
        globalData.costoMO[i] = costoMO;
        
        html += `<div class="flex justify-between border-b pb-2">
            <div>
                <div class="font-medium">Año ${i + 1}</div>
                <div class="text-sm text-gray-600">${horasRequeridas.toLocaleString('es-MX', {minimumFractionDigits: 1})} horas</div>
            </div>
            <div class="text-right">
                <div class="text-lg font-semibold text-blue-600">${costoMO.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
            </div>
        </div>`;
    }
    
    html += '</div>';
    document.getElementById('costo-mo').innerHTML = html;
    calcularCostoProduccion();
}

function agregarGastoFijo() {
    const container = document.querySelector('#ppto-gts-i .space-y-2:first-of-type');
    const newRow = document.createElement('div');
    newRow.className = 'grid grid-cols-2 gap-2 mt-2';
    newRow.innerHTML = `
        <input type="text" placeholder="Concepto" class="gasto-fijo-concepto text-sm">
        <input type="number" placeholder="Monto anual" class="gasto-fijo-monto text-sm" step="0.01" onchange="calcularGastosIndirectos()">
    `;
    container.appendChild(newRow);
}

function agregarGastoVariable() {
    const container = document.querySelector('#ppto-gts-i .space-y-2:last-of-type');
    const newRow = document.createElement('div');
    newRow.className = 'grid grid-cols-3 gap-2 mt-2';
    newRow.innerHTML = `
        <input type="text" placeholder="Concepto" class="gasto-var-concepto text-sm">
        <input type="number" placeholder="Por unidad" class="gasto-var-unidad text-sm" step="0.001" onchange="calcularGastosIndirectos()">
        <input type="text" placeholder="Unidad" class="gasto-var-tipo text-sm">
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
            totalVariables += costoPorUnidad * globalData.unidadesProduccion[año];
        });
        
        const totalGastosIndirectos = totalFijos + totalVariables;
        globalData.gastosIndirectos[año] = totalGastosIndirectos;
        
        html += `<div class="flex justify-between border-b pb-2">
            <div>
                <div class="font-medium">Año ${año + 1}</div>
                <div class="text-xs text-gray-500">Fijos: ${totalFijos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
                <div class="text-xs text-gray-500">Variables: ${totalVariables.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
            </div>
            <div class="text-lg font-semibold text-purple-600">${totalGastosIndirectos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
        </div>`;
    }
    
    html += '</div>';
    document.getElementById('gastos-indirectos-resultado').innerHTML = html;
    calcularCostoProduccion();
}

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
        
        if (año === 0) {
            document.getElementById('costo-unitario-pt').value = costoUnitario.toFixed(2);
        }
        
        const invFinalPT = parseFloat(document.getElementById(`inv-final-${año + 1}`).value) || 0;
        const invInicialPTAnual = año === 0 ? invInicialPT * costoUnitario : parseFloat(document.getElementById(`inv-final-${año}`).value) * costoUnitario;
        const costoVendido = invInicialPTAnual + costoProduccionTotal - (invFinalPT * costoUnitario);
        
        globalData.costoVendido[año] = Math.max(0, costoVendido);
        
        html += `<div class="flex justify-between border-b pb-2">
            <div>
                <div class="font-medium">Año ${año + 1}</div>
                <div class="text-xs text-gray-500">MP: ${costoMP.toLocaleString('es-MX')}</div>
                <div class="text-xs text-gray-500">MO: ${costoMO.toLocaleString('es-MX')}</div>
                <div class="text-xs text-gray-500">GI: ${gastosInd.toLocaleString('es-MX')}</div>
            </div>
            <div class="text-lg font-semibold text-green-600">${costoProduccionTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
        </div>`;
        
        htmlVendido += `<div class="flex justify-between border-b pb-2">
            <span class="font-medium">Año ${año + 1}</span>
            <span class="text-lg font-semibold text-red-600">${costoVendido.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
        </div>`;
    }
    
    html += '</div>';
    htmlVendido += '</div>';
    
    document.getElementById('costo-produccion-anual').innerHTML = html;
    document.getElementById('costo-vendido-anual').innerHTML = htmlVendido;
    calcularEstadoResultados();
}

function agregarGastoAdmin() {
    const container = document.getElementById('gastos-admin-container');
    const newRow = document.createElement('div');
    newRow.className = 'grid grid-cols-2 gap-2 mb-2';
    newRow.innerHTML = `
        <input type="text" placeholder="Concepto" class="gasto-admin-concepto text-sm">
        <input type="number" placeholder="Monto mensual" class="gasto-admin-monto text-sm" step="0.01" onchange="calcularGastosOperacion()">
    `;
    container.appendChild(newRow);
}

function agregarGastoVentas() {
    const container = document.getElementById('gastos-ventas-container');
    const newRow = document.createElement('div');
    newRow.className = 'grid grid-cols-2 gap-2 mb-2';
    newRow.innerHTML = `
        <input type="text" placeholder="Concepto" class="gasto-ventas-concepto text-sm">
        <input type="number" placeholder="% de ventas" class="gasto-ventas-pct text-sm" step="0.1" onchange="calcularGastosOperacion()">
    `;
    container.appendChild(newRow);
}

function calcularGastosOperacion() {
    const gastosAdmin = document.querySelectorAll('.gasto-admin-monto');
    const gastosVentas = document.querySelectorAll('.gasto-ventas-pct');
    
    let html = '<div class="space-y-2">';
    
    for (let año = 0; año < 5; año++) {
        let totalAdmin = 0;
        gastosAdmin.forEach(input => {
            const montoMensual = parseFloat(input.value) || 0;
            totalAdmin += montoMensual * 12;
        });
        
        let totalVentas = 0;
        const ventasAnuales = globalData.ventasProyeccion[año] || 0;
        gastosVentas.forEach(input => {
            const porcentaje = parseFloat(input.value) || 0;
            totalVentas += ventasAnuales * (porcentaje / 100);
        });
        
        const totalGastosOp = totalAdmin + totalVentas;
        globalData.gastosOperacion[año] = totalGastosOp;
        
        html += `<div class="flex justify-between border-b pb-2">
            <div>
                <div class="font-medium">Año ${año + 1}</div>
                <div class="text-xs text-gray-500">Admin: ${totalAdmin.toLocaleString('es-MX')}</div>
                <div class="text-xs text-gray-500">Ventas: ${totalVentas.toLocaleString('es-MX')}</div>
            </div>
            <div class="text-lg font-semibold text-orange-600">${totalGastosOp.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
        </div>`;
    }
    
    html += '</div>';
    document.getElementById('gastos-operacion-resultado').innerHTML = html;
    calcularEstadoResultados();
}

function calcularFlujoEfectivo() {
    const inversionInicial = parseFloat(document.getElementById('inversion-inicial').value) || 0;
    const saldoInicial = parseFloat(document.getElementById('saldo-inicial').value) || 0;
    const pctCobroEfectivo = parseFloat(document.getElementById('pct-cobro-efectivo').value) || 80;
    
    let html = '<div class="overflow-x-auto">';
    html += '<table class="min-w-full text-sm">';
    html += '<thead class="table-header"><tr><th class="px-3 py-2">Concepto</th>';
    
    for (let año = 1; año <= 5; año++) {
        html += `<th class="px-3 py-2">Año ${año}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    html += '<tr class="table-row"><td class="px-3 py-2 font-semibold">INGRESOS</td>';
    let ingresosPorAño = [];
    for (let año = 0; año < 5; año++) {
        const ventasEfectivo = globalData.ventasProyeccion[año] * (pctCobroEfectivo / 100);
        ingresosPorAño[año] = ventasEfectivo;
        html += `<td class="px-3 py-2 text-green-600 font-semibold">${ventasEfectivo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2 font-semibold">EGRESOS</td>';
    let egresosPorAño = [];
    for (let año = 0; año < 5; año++) {
        const egresos = (globalData.comprasMP[año] || 0) + 
                        (globalData.costoMO[año] || 0) + 
                        (globalData.gastosIndirectos[año] || 0) + 
                        (globalData.gastosOperacion[año] || 0);
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
    const ventasTotal = globalData.ventasProyeccion.reduce((a, b) => a + b, 0);
    const utilidadBruta5Años = globalData.ventasProyeccion.reduce((total, venta, index) => {
        return total + venta - (globalData.costoVendido[index] || 0);
    }, 0);
    
    const utilidadNeta5Años = globalData.utilidadNeta.reduce((a, b) => a + b, 0);
    
    const margenPromedio = ventasTotal > 0 ? (utilidadBruta5Años / ventasTotal * 100) : 0;
    const roiProyectado = inversionInicial > 0 ? (utilidadNeta5Años / inversionInicial * 100) : 0;
    
    let html = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-green-100 p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-green-700">${ventasTotal.toLocaleString('es-MX', {minimumFractionDigits: 0})}</div>
                <div class="text-sm text-green-600">Ingresos Totales (5 años)</div>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-blue-700">${utilidadNeta5Años.toLocaleString('es-MX', {minimumFractionDigits: 0})}</div>
                <div class="text-sm text-blue-600">Utilidad Neta (5 años)</div>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-purple-700">${margenPromedio.toFixed(1)}%</div>
                <div class="text-sm text-purple-600">Margen Bruto Promedio</div>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-yellow-700">${roiProyectado.toFixed(1)}%</div>
                <div class="text-sm text-yellow-600">ROI Proyectado</div>
            </div>
        </div>
        <div class="mt-4 text-sm text-gray-600">
            <p><strong>Punto de Equilibrio:</strong> Se alcanza cuando los ingresos igualan los costos totales.</p>
            <p><strong>Recomendación:</strong> ${margenPromedio > 20 ? 'Proyecto viable con buen margen de rentabilidad.' : 'Revisar costos para mejorar rentabilidad.'}</p>
            <p><strong>Análisis de Penetración:</strong> Año 1: ${globalData.penetracionMercado[0].toFixed(1)}% → Año 5: ${globalData.penetracionMercado[4].toFixed(1)}%</p>
        </div>
    `;
    
    document.getElementById('resumen-ejecutivo').innerHTML = html;
}

// ===========================
// FUNCIONES AUXILIARES
// ===========================
function exportarDatos() {
    const data = {
        timestamp: new Date().toISOString(),
        globalData: globalData,
        inputs: {}
    };
    
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

function imprimirReporte() {
    window.print();
}

function checkMobile() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.add('text-xs', 'px-2', 'py-1');
            btn.classList.remove('px-3', 'py-2');
        });
    } else {
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('text-xs', 'px-2', 'py-1');
            btn.classList.add('px-3', 'py-2');
        });
    }
}

// ===========================
// INICIALIZACIÓN
// ===========================
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'p':
                e.preventDefault();
                imprimirReporte();
                break;
            case 's':
                e.preventDefault();
                exportarDatos();
                break;
        }
    }
});

window.addEventListener('resize', checkMobile);

document.addEventListener('DOMContentLoaded', function() {
    checkMobile();
    console.log('Sistema de Análisis Financiero v2.0 Cargado');
    console.log('Nuevas funcionalidades: Concentración, Penetración, Precio Variable, Condiciones Comerciales, Depreciación, Estados Financieros');
});// ===========================
// ALMACENAMIENTO GLOBAL DE DATOS MEJORADO
// ===========================
let globalData = {
    // Mercado
    mercadoMeta: 0,
    porcentajeConcentracion: 0,
    penetracionMercado: [0,0,0,0,0],
    
    // Ventas
    unidadesVenta: [0,0,0,0,0],
    precioUnitario: [0,0,0,0,0],
    incrementoUnidades: 0,
    ventasProyeccion: [0,0,0,0,0],
    
    // Producción
    unidadesProduccion: [0,0,0,0,0],
    
    // Materiales
    materiaPrima: [],
    costoMP: [],
    consumoMP: [],
    comprasMP: [],
    
    // Costos
    costoMO: [0,0,0,0,0],
    gastosIndirectos: [0,0,0,0,0],
    costoProduccion: [0,0,0,0,0],
    costoVendido: [0,0,0,0,0],
    gastosOperacion: [0,0,0,0,0],
    
    // Condiciones comerciales
    diasCredito: {ventas: 0, compras: 0},
    descuentoProntoPago: 0,
    
    // Inversiones
    inversionesActivo: [],
    depreciacion: [0,0,0,0,0],
    amortizacion: [0,0,0,0,0],
    
    // Estados financieros
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
    event.target.classList.add('active');
}

// ===========================
// PESTAÑA 1: MERCADO META MEJORADO
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
// PESTAÑA 2: PROYECCIÓN DE VENTAS MEJORADA
// ===========================
function calcularFactSensibil() {
    const participacionMercado = parseFloat(document.getElementById('participacion-mercado').value) || 0;
    const incrementoPoblacion = parseFloat(document.getElementById('incremento-poblacion').value) || 0;
    const incrementoProducto = parseFloat(document.getElementById('incremento-producto').value) || 0;
    const penetracionInicial = parseFloat(document.getElementById('penetracion-inicial').value) || 0;
    const incrementoPenetracion = parseFloat(document.getElementById('incremento-penetracion').value) || 0;
    
    const mercadoBase = globalData.mercadoMeta;
    
    if (mercadoBase === 0) {
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
// PESTAÑA 3: PRESUPUESTO DE INGRESOS MEJORADO (PRECIO VARIABLE)
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
// CONDICIONES COMERCIALES
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
// NUEVA PESTAÑA: INVERSIONES Y DEPRECIACIÓN
// ===========================
function agregarInversion() {
    const container = document.getElementById('inversiones-container');
    const newRow = document.createElement('div');
    newRow.className = 'inversion-item grid grid-cols-5 gap-2 mb-2 items-center';
    newRow.innerHTML = `
        <input type="text" placeholder="Nombre Activo" class="inv-nombre text-sm col-span-1">
        <input type="number" placeholder="Monto" class="inv-monto text-sm col-span-1" step="0.01">
        <input type="number" placeholder="Vida útil" class="inv-vida text-sm col-span-1">
        <select class="inv-tipo text-sm col-span-1">
            <option value="lineal">Lineal</option>
            <option value="acelerada">Acelerada</option>
        </select>
        <button class="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs col-span-1">Calcular</button>
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
                } else { // acelerada
                    const factor = 2 / vidaUtil;
                    let valorLibros = monto;
                    for (let a = 0; a < año; a++) {
                        valorLibros -= valorLibros * factor;
                    }
                    depreciacion = año < vidaUtil ? valorLibros * factor : 0;
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
// NUEVA PESTAÑA: ESTADO DE RESULTADOS INTEGRAL
// ===========================
function calcularEstadoResultados() {
    let html = '<div class="overflow-x-auto"><table class="min-w-full text-sm">';
    html += '<thead class="table-header"><tr><th class="px-3 py-2">Concepto</th>';
    
    for (let año = 1; año <= 5; año++) {
        html += `<th class="px-3 py-2">Año ${año}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    // Ingresos
    html += '<tr class="table-row bg-green-50"><td class="px-3 py-2 font-bold">INGRESOS</td>';
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2 font-semibold text-green-600">$${globalData.ventasProyeccion[año].toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Costo de ventas
    html += '<tr class="table-row"><td class="px-3 py-2">(-) Costo de lo Vendido</td>';
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2 text-red-600">$${globalData.costoVendido[año].toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Utilidad Bruta
    html += '<tr class="table-row bg-blue-50"><td class="px-3 py-2 font-bold">UTILIDAD BRUTA</td>';
    let utilidadBruta = [];
    for (let año = 0; año < 5; año++) {
        const ub = globalData.ventasProyeccion[año] - globalData.costoVendido[año];
        utilidadBruta[año] = ub;
        html += `<td class="px-3 py-2 font-semibold">$${ub.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Gastos de Operación
    html += '<tr class="table-row"><td class="px-3 py-2">(-) Gastos de Operación</td>';
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2 text-red-600">$${globalData.gastosOperacion[año].toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Depreciación
    html += '<tr class="table-row"><td class="px-3 py-2">(-) Depreciación</td>';
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2 text-red-600">$${globalData.depreciacion[año].toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Utilidad de Operación
    html += '<tr class="table-row bg-yellow-50"><td class="px-3 py-2 font-bold">UTILIDAD DE OPERACIÓN</td>';
    let utilidadOperacion = [];
    for (let año = 0; año < 5; año++) {
        const uo = utilidadBruta[año] - globalData.gastosOperacion[año] - globalData.depreciacion[año];
        utilidadOperacion[año] = uo;
        html += `<td class="px-3 py-2 font-semibold">$${uo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // ISR (30%)
    html += '<tr class="table-row"><td class="px-3 py-2">(-) ISR (30%)</td>';
    for (let año = 0; año < 5; año++) {
        const isr = Math.max(0, utilidadOperacion[año] * 0.30);
        html += `<td class="px-3 py-2 text-red-600">$${isr.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Utilidad Neta
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
// NUEVA PESTAÑA: ESTADO DE SITUACIÓN FINANCIERA
// ===========================
function calcularEstadoSituacion() {
    const inversionInicial = parseFloat(document.getElementById('inversion-inicial').value) || 0;
    
    let html = '<div class="overflow-x-auto"><table class="min-w-full text-sm">';
    html += '<thead class="table-header"><tr><th class="px-3 py-2">Concepto</th>';
    
    for (let año = 1; año <= 5; año++) {
        html += `<th class="px-3 py-2">Año ${año}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    // ACTIVOS
    html += '<tr class="bg-blue-100"><td colspan="6" class="px-3 py-2 font-bold">ACTIVOS</td></tr>';
    
    // Efectivo (simplificado)
    html += '<tr class="table-row"><td class="px-3 py-2">Efectivo</td>';
    for (let año = 0; año < 5; año++) {
        const efectivo = globalData.utilidadNeta[año] * 0.3; // Simplificación
        html += `<td class="px-3 py-2">$${efectivo.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Cuentas por Cobrar
    html += '<tr class="table-row"><td class="px-3 py-2">Cuentas por Cobrar</td>';
    for (let año = 0; año < 5; año++) {
        const cxc = globalData.ventasProyeccion[año] * (globalData.diasCredito.ventas / 360);
        html += `<td class="px-3 py-2">$${cxc.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // Activo Fijo
    html += '<tr class="table-row"><td class="px-3 py-2">Activo Fijo Neto</td>';
    for (let año = 0; año < 5; año++) {
        let totalInversion = globalData.inversionesActivo.reduce((sum, inv) => sum + inv.monto, 0);
        let depreciacionAcum = 0;
        for (let a = 0; a <= año; a++) {
            depreciacionAcum += globalData.depreciacion[a];
        }
        const activoNeto = totalInversion - depreciacionAcum;
        html += `<td class="px-3 py-2">$${Math.max(0, activoNeto).toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // PASIVOS
    html += '<tr class="bg-red-100"><td colspan="6" class="px-3 py-2 font-bold">PASIVOS</td></tr>';
    
    // Cuentas por Pagar
    html += '<tr class="table-row"><td class="px-3 py-2">Cuentas por Pagar</td>';
    for (let año = 0; año < 5; año++) {
        const cxp = globalData.comprasMP[año] * (globalData.diasCredito.compras / 360);
        html += `<td class="px-3 py-2">$${cxp.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    // CAPITAL
    html += '<tr class="bg-green-100"><td colspan="6" class="px-3 py-2 font-bold">CAPITAL CONTABLE</td></tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">Capital Social</td>';
    for (let año = 0; año < 5; año++) {
        html += `<td class="px-3 py-2">$${inversionInicial.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '<tr class="table-row"><td class="px-3 py-2">Utilidades Retenidas</td>';
    let utilidadAcum = 0;
    for (let año = 0; año < 5; año++) {
        utilidadAcum += globalData.utilidadNeta[año];
        html += `<td class="px-3 py-2">$${utilidadAcum.toLocaleString('es-MX', {minimumFractionDigits: 0})}</td>`;
    }
    html += '</tr>';
    
    html += '</tbody></table></div>';
    
    document.getElementById('estado-situacion').innerHTML = html;
}

// ===========================
// FUNCIONES EXISTENTES (mantener las originales)
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

// [Continúa con las demás funciones originales...]
// Por brevedad, incluyo solo las principales modificaciones

function exportarDatos() {
    const data = {
        timestamp: new Date().toISOString(),
        globalData: globalData,
        inputs: {}
    };
    
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

function imprimirReporte() {
    window.print();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Análisis Financiero Cargado');
});

function nuevoProyecto() {
    // Limpia el ID y el nombre del proyecto
    document.getElementById('id_proyecto_actual').value = '';
    document.getElementById('nombre_proyecto').value = '';

    // Limpia todos los demás campos de texto y número del formulario
    const formulario = document.querySelector('main');
    const inputs = formulario.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => {
        if (input.id !== 'nombre_proyecto') {
            input.value = '';
        }
    });

    // Limpia los contenedores de las listas dinámicas
    document.getElementById('inversiones-container').innerHTML = '';
    document.getElementById('receta-container').innerHTML = '';
    document.getElementById('costos-mp-container').innerHTML = '';
    document.getElementById('gastos-admin-container').innerHTML = '';
    document.getElementById('gastos-ventas-container').innerHTML = '';

    console.log('Formulario limpiado.');
}

function guardarProyecto() {
    console.log("Iniciando el proceso de guardado...");

    // PARTE 1: Recolecta todos los campos de texto principales
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
    };

    // PARTE 2: Recolecta todas las listas dinámicas
    const inversiones = [];
    document.querySelectorAll('#inversiones-container .inversion-item').forEach(fila => {
        const nombre = fila.querySelector('.inv-nombre').value;
        const monto = fila.querySelector('.inv-monto').value;
        const vida = fila.querySelector('.inv-vida').value;
        const tipo = fila.querySelector('.inv-tipo').value;
        if (nombre && monto && vida) {
            inversiones.push({ nombre, monto, vida_util: vida, tipo });
        }
    });
    datosDelProyecto.inversiones = inversiones;

    const materiasPrimas = [];
    const filasMP = document.querySelectorAll('#receta-container .mp-item');
    const costosMP = document.querySelectorAll('#costos-mp-container .costo-mp-item');
    filasMP.forEach((fila, index) => {
        const nombre = fila.querySelector('.receta-mp').value;
        const cantidad = fila.querySelector('.receta-cant').value;
        const unidad = fila.querySelector('.receta-unidad').value;
        const costo = costosMP[index] ? costosMP[index].querySelector('.costo-mp').value : 0;
        if (nombre && cantidad) {
            materiasPrimas.push({ nombre, cantidad, unidad, costo_unitario: costo });
        }
    });
    datosDelProyecto.materias_primas = materiasPrimas;

    const gastosAdmin = [];
    document.querySelectorAll('#gastos-admin-container .gasto-admin-item').forEach(fila => {
        const concepto = fila.querySelector('.gasto-admin-concepto').value;
        const monto = fila.querySelector('.gasto-admin-monto').value;
        if (concepto && monto) {
            gastosAdmin.push({ concepto, monto_mensual: monto });
        }
    });
    datosDelProyecto.gastos_admin = gastosAdmin;

    const gastosVentas = [];
    document.querySelectorAll('#gastos-ventas-container .gasto-ventas-item').forEach(fila => {
        const concepto = fila.querySelector('.gasto-ventas-concepto').value;
        const porcentaje = fila.querySelector('.gasto-ventas-pct').value;
        if (concepto && porcentaje) {
            gastosVentas.push({ concepto, porcentaje_sobre_ventas: porcentaje });
        }
    });
    datosDelProyecto.gastos_ventas = gastosVentas;

    console.log("Datos que se enviarán al servidor:", datosDelProyecto);

    // PARTE 3: Envía todo al backend
    fetch('api/guardar_proyecto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosDelProyecto)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert(data.message || '¡Acción completada!');
        cargarListaDeProyectos();
    })
    .catch(error => {
        console.error('Error al intentar guardar:', error);
        alert('Hubo un error al guardar. Revisa la consola.');
    });
}

// 1. FUNCIÓN PARA CARGAR LA LISTA DE PROYECTOS
function cargarListaDeProyectos() {
    fetch('api/cargar_proyectos.php')
        .then(response => response.json())
        .then(proyectos => {
            const lista = document.getElementById('lista-proyectos');
            lista.innerHTML = ''; // Limpiar la lista
            if (proyectos.length === 0) {
                lista.innerHTML = '<li>No hay proyectos guardados.</li>';
            } else {
                proyectos.forEach(proyecto => {
                    lista.innerHTML += `
                        <li>
                            <a href="#" class="text-blue-600 hover:underline" onclick="cargarProyecto(${proyecto.id_proyecto}); return false;">
                                ${proyecto.nombre_proyecto}
                            </a>
                        </li>
                    `;
                });
            }
        });
}

// 2. FUNCIÓN PARA CARGAR LOS DATOS DE UN PROYECTO ESPECÍFICO
function cargarProyecto(id) {
    console.log(`Cargando datos para el proyecto con ID: ${id}`);
    fetch(`api/obtener_proyecto.php?id=${id}`)
        .then(response => response.json())
        .then(datos => {
            // Limpia completamente el formulario antes de llenarlo
            nuevoProyecto();

            // === RELLENAR TODOS LOS CAMPOS PRINCIPALES ===
            document.getElementById('id_proyecto_actual').value = datos.id_proyecto;
            document.getElementById('nombre_proyecto').value = datos.nombre_proyecto;
            
            // Pestaña 1
            document.getElementById('poblacion-total').value = datos.poblacion_total;
            document.getElementById('porcentaje-mujeres').value = datos.pct_mujeres;
            document.getElementById('rango-edad').value = datos.pct_rango_edad;
            document.getElementById('poblacion-ocupada').value = datos.pct_poblacion_ocupada;
            document.getElementById('concentracion-mercado').value = datos.pct_concentracion_mercado;
            
            // Pestaña 2
            document.getElementById('participacion-mercado').value = datos.participacion_mercado;
            document.getElementById('incremento-poblacion').value = datos.incremento_poblacion;
            document.getElementById('incremento-producto').value = datos.incremento_producto;
            document.getElementById('penetracion-inicial').value = datos.penetracion_inicial;
            document.getElementById('incremento-penetracion').value = datos.incremento_penetracion;

            // Pestaña 3
            document.getElementById('precio-unitario-base').value = datos.precio_unitario_base;
            document.getElementById('incremento-precio').value = datos.incremento_precio;
            document.getElementById('unidades-1').value = datos.unidades_venta_a1;
            document.getElementById('unidades-2').value = datos.unidades_venta_a2;
            document.getElementById('unidades-3').value = datos.unidades_venta_a3;
            document.getElementById('unidades-4').value = datos.unidades_venta_a4;
            document.getElementById('unidades-5').value = datos.unidades_venta_a5;
            
            // Pestaña 4
            document.getElementById('dias-credito-ventas').value = datos.dias_credito_ventas;
            document.getElementById('dias-credito-compras').value = datos.dias_credito_compras;
            document.getElementById('descuento-pronto-pago').value = datos.descuento_pronto_pago;

            // Pestaña 6
            document.getElementById('inv-inicial-prod').value = datos.inv_inicial_prod;
            document.getElementById('inv-final-1').value = datos.inv_final_a1;
            document.getElementById('inv-final-2').value = datos.inv_final_a2;
            document.getElementById('inv-final-3').value = datos.inv_final_a3;
            document.getElementById('inv-final-4').value = datos.inv_final_a4;
            document.getElementById('inv-final-5').value = datos.inv_final_a5;

            // Pestaña 8
            document.getElementById('inv-inicial-mp').value = datos.inv_inicial_mp;
            document.getElementById('inv-final-mp-pct').value = datos.inv_final_mp_pct;

            // Pestaña 10
            document.getElementById('tiempo-unidad').value = datos.tiempo_unidad_mo;
            document.getElementById('costo-hora').value = datos.costo_hora_mo;

            // === RELLENAR TODAS LAS LISTAS DINÁMICAS ===
            if (datos.inversiones && datos.inversiones.length > 0) {
                datos.inversiones.forEach(inversion => agregarInversion(inversion));
            }
            if (datos.materias_primas && datos.materias_primas.length > 0) {
                datos.materias_primas.forEach(mp => agregarMateriaPrima(mp));
            }
            if (datos.gastos_admin && datos.gastos_admin.length > 0) {
                datos.gastos_admin.forEach(gasto => agregarGastoAdmin(gasto));
            }
            if (datos.gastos_ventas && datos.gastos_ventas.length > 0) {
                datos.gastos_ventas.forEach(gasto => agregarGastoVentas(gasto));
            }

            alert(`Proyecto "${datos.nombre_proyecto}" cargado correctamente.`);
        })
        .catch(error => {
            console.error('Error al cargar el proyecto:', error);
            alert('No se pudo cargar la información del proyecto.');
        });
}

// 3. EVENTO QUE INICIA TODO AL CARGAR LA PÁGINA
// Carga la lista de proyectos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', cargarListaDeProyectos);

// graficar proyección de mercado
// ===========================
// GRÁFICOS CON CHART.JS
// ===========================

let chartVentas = null;
let chartResultados = null;
let chartFlujo = null;

// Gráfico 1: Ingresos y Costos por Año (Pestaña Ventas)
function generarGraficoVentas() {
    const ctx = document.getElementById('chartVentas');
    if (!ctx) return;
    
    if (chartVentas) chartVentas.destroy();
    
    chartVentas = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: globalData.ventasProyeccion,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                },
                {
                    label: 'Costo de Ventas',
                    data: globalData.costoVendido,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Proyección de Ingresos vs Costos',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-MX');
                        }
                    }
                }
            }
        }
    });
}

// Gráfico 2: Utilidad Neta (Pestaña Estado de Resultados)
function generarGraficoResultados() {
    const ctx = document.getElementById('chartResultados');
    if (!ctx) return;
    
    if (chartResultados) chartResultados.destroy();
    
    chartResultados = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
            datasets: [{
                label: 'Utilidad Neta',
                data: globalData.utilidadNeta,
                backgroundColor: globalData.utilidadNeta.map(val => 
                    val >= 0 ? 'rgba(39, 174, 96, 0.7)' : 'rgba(231, 76, 60, 0.7)'
                ),
                borderColor: globalData.utilidadNeta.map(val => 
                    val >= 0 ? '#27ae60' : '#e74c3c'
                ),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Utilidad Neta por Año',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-MX');
                        }
                    }
                }
            }
        }
    });
}

// Gráfico 3: Flujo de Efectivo (Pestaña Flujo Efectivo)
function generarGraficoFlujo() {
    const ctx = document.getElementById('chartFlujo');
    if (!ctx) return;
    
    if (chartFlujo) chartFlujo.destroy();
    
    // Calcular flujo neto por año
    const flujoNeto = [];
    for (let i = 0; i < 5; i++) {
        const ingresos = globalData.ventasProyeccion[i] * 0.8; // % cobro efectivo
        const egresos = (globalData.comprasMP[i] || 0) + 
                       (globalData.costoMO[i] || 0) + 
                       (globalData.gastosIndirectos[i] || 0) + 
                       (globalData.gastosOperacion[i] || 0);
        flujoNeto.push(ingresos - egresos);
    }
    
    chartFlujo = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
            datasets: [{
                label: 'Flujo Neto de Efectivo',
                data: flujoNeto,
                backgroundColor: flujoNeto.map(val => 
                    val >= 0 ? 'rgba(52, 152, 219, 0.7)' : 'rgba(231, 76, 60, 0.7)'
                ),
                borderColor: flujoNeto.map(val => 
                    val >= 0 ? '#3498db' : '#e74c3c'
                ),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Flujo de Efectivo por Año',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-MX');
                        }
                    }
                }
            }
        }
    });
}

// ===========================
// ACTUALIZAR GRÁFICOS AUTOMÁTICAMENTE
// ===========================

// Modifica tus funciones existentes para actualizar los gráficos
const calcularPptoVtasOriginal = calcularPptoVtas;
calcularPptoVtas = function() {
    calcularPptoVtasOriginal();
    generarGraficoVentas();
}

const calcularEstadoResultadosOriginal = calcularEstadoResultados;
calcularEstadoResultados = function() {
    calcularEstadoResultadosOriginal();
    generarGraficoResultados();
}

const calcularFlujoEfectivoOriginal = calcularFlujoEfectivo;
calcularFlujoEfectivo = function() {
    calcularFlujoEfectivoOriginal();
    generarGraficoFlujo();
}