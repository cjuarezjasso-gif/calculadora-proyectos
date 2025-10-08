// Sistema Central de Gestión de Datos - Proyecto Salcera
class ProyectoSalcera {
  constructor() {
    this.data = {
      configuracion: {
        tasaISR: 30.0,
        tasaInteres: 19.0,
        tasaInflacion: 4.5,
        renta: 2500,
        manoObraDirecta: 0.50
      },
      ventas: {
        precioUnitario: 30.0,
        unidadesIniciales: 50000,
        crecimientoMercado: 15.0,
        proyecciones: []
      },
      compras: {
        costoUnitario: 10.0,
        insumosIniciales: 40000,
        crecimientoInsumos: 10.0,
        proyecciones: []
      },
      viabilidad: {
        inversionInicial: 100000,
        horizonte: 5,
        tasaDescuento: 12.5,
        flujoCaja: [],
        indicadores: {
          van: 0,
          tir: 0,
          pri: 0,
          relacionCB: 0
        }
      },
      indicadores: {
        financieros: [],
        rentabilidad: [],
        liquidez: []
      }
    };
    
    this.observers = [];
    this.cargarDatos();
  }

  // Sistema de observadores para notificar cambios
  suscribir(callback) {
    this.observers.push(callback);
  }

  notificar(seccion, datos) {
    this.observers.forEach(callback => callback(seccion, datos));
  }

  // Gestión de datos persistentes
  cargarDatos() {
    try {
      const datosGuardados = localStorage.getItem('proyectoSalceraData');
      if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        this.data = { ...this.data, ...datos };
      }
    } catch (error) {
      console.warn('Error al cargar datos guardados:', error);
    }
  }

  guardarDatos() {
    try {
      localStorage.setItem('proyectoSalceraData', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  }

  // Métodos de configuración
  actualizarConfiguracion(nuevaConfig) {
    this.data.configuracion = { ...this.data.configuracion, ...nuevaConfig };
    this.guardarDatos();
    this.recalcularTodo();
    this.notificar('configuracion', this.data.configuracion);
  }

  obtenerConfiguracion() {
    return this.data.configuracion;
  }

  // Métodos de ventas
  calcularProyeccionVentas(params = null) {
    const config = params || this.data.ventas;
    const { precioUnitario, unidadesIniciales, crecimientoMercado } = config;
    const inflacion = this.data.configuracion.tasaInflacion / 100;
    const crecimiento = crecimientoMercado / 100;
    
    const proyecciones = [];
    
    for (let i = 0; i < this.data.viabilidad.horizonte; i++) {
      const año = i + 1;
      const unidades = Math.round(unidadesIniciales * Math.pow(1 + crecimiento, i));
      const precioAjustado = precioUnitario * Math.pow(1 + inflacion, i);
      const ventasTotales = unidades * precioAjustado;
      
      proyecciones.push({
        año,
        precio: precioAjustado,
        unidades,
        ventasTotales
      });
    }
    
    this.data.ventas.proyecciones = proyecciones;
    this.guardarDatos();
    this.notificar('ventas', proyecciones);
    return proyecciones;
  }

  // Métodos de compras
  calcularProyeccionCompras(params = null) {
    const config = params || this.data.compras;
    const { costoUnitario, insumosIniciales, crecimientoInsumos } = config;
    const inflacion = this.data.configuracion.tasaInflacion / 100;
    const crecimiento = crecimientoInsumos / 100;
    
    const proyecciones = [];
    
    for (let i = 0; i < this.data.viabilidad.horizonte; i++) {
      const año = i + 1;
      const insumos = Math.round(insumosIniciales * Math.pow(1 + crecimiento, i));
      const costoAjustado = costoUnitario * Math.pow(1 + inflacion, i);
      const costoTotal = insumos * costoAjustado;
      
      proyecciones.push({
        año,
        costoUnitario: costoAjustado,
        insumos,
        costoTotal
      });
    }
    
    this.data.compras.proyecciones = proyecciones;
    this.guardarDatos();
    this.notificar('compras', proyecciones);
    return proyecciones;
  }

  // Métodos de viabilidad
  calcularViabilidad(params = null) {
    const config = params || this.data.viabilidad;
    const { inversionInicial, horizonte, tasaDescuento } = config;
    const tasa = tasaDescuento / 100;
    
    // Asegurar que tenemos proyecciones actualizadas
    if (this.data.ventas.proyecciones.length === 0) {
      this.calcularProyeccionVentas();
    }
    if (this.data.compras.proyecciones.length === 0) {
      this.calcularProyeccionCompras();
    }

    const flujoCaja = [];
    let vanAcumulado = -inversionInicial;
    
    for (let i = 0; i < horizonte; i++) {
      const ventasProyectadas = this.data.ventas.proyecciones[i]?.ventasTotales || 0;
      const comprasProyectadas = this.data.compras.proyecciones[i]?.costoTotal || 0;
      const rentaAnual = this.data.configuracion.renta * 12;
      const manoObraTotal = this.data.ventas.proyecciones[i]?.unidades * this.data.configuracion.manoObraDirecta || 0;
      
      const ingresos = ventasProyectadas;
      const costos = comprasProyectadas + rentaAnual + manoObraTotal;
      const utilidadAntesISR = ingresos - costos;
      const isr = utilidadAntesISR > 0 ? utilidadAntesISR * (this.data.configuracion.tasaISR / 100) : 0;
      const flujoNeto = utilidadAntesISR - isr;
      
      const valorPresente = flujoNeto / Math.pow(1 + tasa, i + 1);
      vanAcumulado += valorPresente;
      
      flujoCaja.push({
        año: i + 1,
        ingresos,
        costos,
        utilidadAntesISR,
        isr,
        flujoNeto,
        valorPresente,
        vanAcumulado
      });
    }

    // Calcular TIR
    const tir = this.calcularTIR(flujoCaja.map(f => f.flujoNeto), inversionInicial);
    
    // Calcular PRI (Período de Recuperación)
    let acumulado = -inversionInicial;
    let pri = horizonte;
    for (let i = 0; i < flujoCaja.length; i++) {
      acumulado += flujoCaja[i].flujoNeto;
      if (acumulado >= 0) {
        pri = i + 1;
        break;
      }
    }

    // Calcular Relación Costo/Beneficio
    const totalIngresos = flujoCaja.reduce((sum, f) => sum + f.valorPresente, 0);
    const relacionCB = totalIngresos / inversionInicial;

    const indicadores = {
      van: vanAcumulado,
      tir: tir * 100,
      pri,
      relacionCB
    };

    this.data.viabilidad.flujoCaja = flujoCaja;
    this.data.viabilidad.indicadores = indicadores;
    this.guardarDatos();
    this.notificar('viabilidad', { flujoCaja, indicadores });
    
    return { flujoCaja, indicadores };
  }

  // Cálculo de TIR usando método de bisección
  calcularTIR(flujos, inversionInicial) {
    let tasaMin = 0;
    let tasaMax = 1;
    let iteraciones = 0;
    const maxIteraciones = 1000;
    const precision = 0.000001;

    while (iteraciones < maxIteraciones) {
      const tasaMedia = (tasaMin + tasaMax) / 2;
      let van = -inversionInicial;
      
      for (let i = 0; i < flujos.length; i++) {
        van += flujos[i] / Math.pow(1 + tasaMedia, i + 1);
      }

      if (Math.abs(van) < precision) {
        return tasaMedia;
      }

      if (van > 0) {
        tasaMin = tasaMedia;
      } else {
        tasaMax = tasaMedia;
      }

      iteraciones++;
    }

    return (tasaMin + tasaMax) / 2;
  }

  // Calcular indicadores financieros
  calcularIndicadores() {
    if (this.data.viabilidad.flujoCaja.length === 0) {
      this.calcularViabilidad();
    }

    const indicadores = {
      financieros: [],
      rentabilidad: [],
      liquidez: []
    };

    for (let i = 0; i < this.data.viabilidad.horizonte; i++) {
      const flujo = this.data.viabilidad.flujoCaja[i];
      const ventas = this.data.ventas.proyecciones[i];
      
      if (flujo && ventas) {
        // Indicadores financieros
        const roa = (flujo.flujoNeto / this.data.viabilidad.inversionInicial) * 100;
        indicadores.financieros.push({
          año: i + 1,
          van: flujo.vanAcumulado,
          roa
        });

        // Indicadores de rentabilidad
        const margenBruto = ((ventas.ventasTotales - this.data.compras.proyecciones[i]?.costoTotal || 0) / ventas.ventasTotales) * 100;
        const margenNeto = (flujo.flujoNeto / ventas.ventasTotales) * 100;
        indicadores.rentabilidad.push({
          año: i + 1,
          margenBruto,
          margenNeto
        });

        // Indicadores de liquidez (simulados)
        const liquidezCorriente = 1.5 + (i * 0.2);
        const pruebaAcida = 1.0 + (i * 0.15);
        indicadores.liquidez.push({
          año: i + 1,
          liquidezCorriente,
          pruebaAcida
        });
      }
    }

    this.data.indicadores = indicadores;
    this.guardarDatos();
    this.notificar('indicadores', indicadores);
    return indicadores;
  }

  // Recalcular todo cuando cambie la configuración
  recalcularTodo() {
    this.calcularProyeccionVentas();
    this.calcularProyeccionCompras();
    this.calcularViabilidad();
    this.calcularIndicadores();
  }

  // Métodos de exportación/importación
  exportarDatos() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'proyecto-salcera-completo.json');
    linkElement.click();
    
    this.mostrarAlerta('Proyecto exportado correctamente.', 'success');
  }

  importarDatos(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          this.data = { ...this.data, ...importedData };
          this.guardarDatos();
          this.recalcularTodo();
          this.mostrarAlerta('Proyecto importado correctamente.', 'success');
          resolve(this.data);
        } catch (error) {
          this.mostrarAlerta('Error al importar el archivo. Formato incorrecto.', 'danger');
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }

  // Utilidades
  mostrarAlerta(mensaje, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      border-radius: 5px;
      color: white;
      z-index: 1000;
      background-color: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
    `;
    alertDiv.textContent = mensaje;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }

  // Obtener todos los datos
  obtenerTodosLosDatos() {
    return this.data;
  }
}

// Instancia global del proyecto
window.proyectoSalcera = new ProyectoSalcera();

// Funciones de utilidad globales
window.formatearMoneda = function(valor) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(valor);
};

window.formatearPorcentaje = function(valor) {
  return `${valor.toFixed(2)}%`;
};

window.formatearNumero = function(valor) {
  return new Intl.NumberFormat('es-MX').format(valor);
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('Sistema integrado de Proyecto Salcera iniciado');
  
  // Calcular datos iniciales
  window.proyectoSalcera.recalcularTodo();
  
  console.log('Datos iniciales calculados:', window.proyectoSalcera.obtenerTodosLosDatos());
});