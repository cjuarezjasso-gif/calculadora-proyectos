// js/indicadores.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Iniciando carga de indicadores.js");

  // Verificar que Chart.js esté disponible
  if (typeof Chart === 'undefined') {
    console.error("Chart.js no está disponible. Verifica que se haya cargado correctamente.");
    alert("Error: Chart.js no está disponible. Verifica la conexión a internet.");
    return;
  }

  // Variables para almacenar las instancias de los gráficos
  let financierosChart = null;
  let rentabilidadChart = null;
  let liquidezChart = null;

  // Cambiar entre pestañas
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  console.log("Tabs encontradas:", tabs.length);
  console.log("Tab contents encontrados:", tabContents.length);

  if (tabs.length === 0) {
    console.warn("No se encontraron pestañas con la clase .tab");
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Clic en pestaña: ${tab.dataset.tab}`);
      
      // Remover clase activa de todas las pestañas y contenidos
      tabs.forEach(t => t.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Activar pestaña clickeada
      tab.classList.add("active");
      
      // Activar contenido correspondiente
      const targetContent = document.getElementById(`${tab.dataset.tab}-tab`);
      if (targetContent) {
        targetContent.classList.add("active");
        console.log(`Activado contenido: ${tab.dataset.tab}-tab`);
      } else {
        console.error(`No se encontró el contenido: ${tab.dataset.tab}-tab`);
      }
    });
  });

  // Configuración común para los gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Datos de ejemplo (ajustados para 3 años según tu HTML)
  const datosFinancieros = {
    labels: ["Año 1", "Año 2", "Año 3"],
    datasets: [
      {
        label: "VAN ($)",
        data: [12000, 18000, 24000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      },
      {
        label: "ROA (%)",
        data: [8, 10, 12],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1
      }
    ]
  };

  const datosRentabilidad = {
    labels: ["Año 1", "Año 2", "Año 3"],
    datasets: [
      {
        label: "Margen Bruto (%)",
        data: [30, 35, 40],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1
      },
      {
        label: "Margen Neto (%)",
        data: [20, 22, 25],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
  };

  const datosLiquidez = {
    labels: ["Año 1", "Año 2", "Año 3"],
    datasets: [
      {
        label: "Liquidez Corriente",
        data: [1.8, 2.0, 2.3],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      },
      {
        label: "Prueba Ácida",
        data: [1.2, 1.4, 1.6],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1
      }
    ]
  };

  // Función para crear gráficos de forma segura
  function crearGrafico(canvasId, tipo, datos, titulo) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`No se encontró el canvas: ${canvasId}`);
      return null;
    }

    try {
      const chart = new Chart(canvas, {
        type: tipo,
        data: datos,
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: titulo
            }
          }
        }
      });
      console.log(`Gráfico ${canvasId} creado exitosamente`);
      return chart;
    } catch (error) {
      console.error(`Error al crear gráfico ${canvasId}:`, error);
      return null;
    }
  }

  // Crear los gráficos
  financierosChart = crearGrafico(
    "financieros-chart", 
    "bar", 
    datosFinancieros, 
    "Indicadores Financieros"
  );

  rentabilidadChart = crearGrafico(
    "rentabilidad-chart", 
    "bar", 
    datosRentabilidad, 
    "Indicadores de Rentabilidad"
  );

  liquidezChart = crearGrafico(
    "liquidez-chart", 
    "bar", 
    datosLiquidez, 
    "Indicadores de Liquidez"
  );

  // Función mejorada para actualizar tablas
  const actualizarTabla = (valores) => {
    console.log("Actualizando tablas con valores:", valores);
    
    Object.keys(valores).forEach(indicador => {
      valores[indicador].forEach((valor, index) => {
        const celda = document.getElementById(`${indicador}-${index + 1}`);
        if (celda) {
          // Formatear el valor según el tipo de indicador
          let valorFormateado;
          if (indicador.includes('van')) {
            valorFormateado = `$${valor.toLocaleString('es-MX')}`;
          } else if (indicador.includes('margen') || indicador.includes('roa')) {
            valorFormateado = `${valor}%`;
          } else {
            valorFormateado = valor.toFixed(2);
          }
          
          celda.textContent = valorFormateado;
          console.log(`Actualizada celda ${indicador}-${index + 1}: ${valorFormateado}`);
        } else {
          console.warn(`No se encontró la celda: ${indicador}-${index + 1}`);
        }
      });
    });
  };

  // Datos para las tablas (ajustados para 3 años según tu HTML)
  const valoresTablas = {
    "van-anual": [12000, 18000, 24000],
    "roa": [8, 10, 12],
    "margen-bruto": [30, 35, 40],
    "margen-neto": [20, 22, 25],
    "liquidez-corriente": [1.8, 2.0, 2.3],
    "prueba-acida": [1.2, 1.4, 1.6]
  };

  // Actualizar las tablas
  actualizarTabla(valoresTablas);

  // Función para recalcular indicadores (puedes expandir esto más tarde)
  window.recalcularIndicadores = function() {
    console.log("Recalculando indicadores...");
    
    // Aquí podrías agregar lógica para recalcular basado en otros datos
    // Por ahora, solo refrescamos con los datos de ejemplo
    
    if (financierosChart) {
      financierosChart.update();
    }
    if (rentabilidadChart) {
      rentabilidadChart.update();
    }
    if (liquidezChart) {
      liquidezChart.update();
    }
    
    actualizarTabla(valoresTablas);
    console.log("Indicadores recalculados");
  };

  // Función para destruir gráficos (útil para evitar memory leaks)
  window.destruirGraficos = function() {
    if (financierosChart) {
      financierosChart.destroy();
      financierosChart = null;
    }
    if (rentabilidadChart) {
      rentabilidadChart.destroy();
      rentabilidadChart = null;
    }
    if (liquidezChart) {
      liquidezChart.destroy();
      liquidezChart = null;
    }
    console.log("Gráficos destruidos");
  };

  console.log("Indicadores.js cargado completamente");
});