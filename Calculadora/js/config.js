// js/config.js - Configuración optimizada con sistema de anuncios

document.addEventListener("DOMContentLoaded", function () {
  // Verificar que el sistema central esté disponible
  if (!window.proyectoSalcera) {
    console.error('Sistema central no disponible');
    return;
  }

  // Elementos del formulario
  const isrInput = document.getElementById("tasa-isr");
  const interesInput = document.getElementById("tasa-interes");
  const inflacionInput = document.getElementById("tasa-inflacion");
  const rentaInput = document.getElementById("costo-renta");
  const manoObraInput = document.getElementById("costo-mano-obra");

  const guardarConfigBtn = document.getElementById("guardar-config");
  const guardarCostosBtn = document.getElementById("guardar-costos");
  const exportarBtn = document.getElementById("exportar-datos");
  const importarBtn = document.getElementById("importar-datos");
  const archivoInput = document.getElementById("importar-archivo");

  // Sistema de anuncios mejorado
  const anuncios = [
    {
      titulo: "¡Configuración Guardada!",
      mensaje: "Tus parámetros económicos han sido actualizados correctamente. El sistema se ha recalculado automáticamente.",
      tipo: "success",
      icono: "✅"
    },
    {
      titulo: "¡Costos Actualizados!",
      mensaje: "Los costos operativos han sido guardados y aplicados a todos los cálculos del proyecto.",
      tipo: "success",
      icono: "💰"
    },
    {
      titulo: "¡Exportación Completa!",
      mensaje: "Todos los datos del proyecto han sido exportados exitosamente a tu archivo.",
      tipo: "info",
      icono: "📄"
    },
    {
      titulo: "¡Datos Importados!",
      mensaje: "El proyecto ha sido importado y todos los cálculos han sido actualizados.",
      tipo: "success",
      icono: "📥"
    },
    {
      titulo: "Auto-guardado Activado",
      mensaje: "Los cambios se guardan automáticamente después de 1 segundo de inactividad.",
      tipo: "info",
      icono: "⚡"
    }
  ];

  // Cargar configuración actual
  function cargarConfiguracion() {
    const config = window.proyectoSalcera.obtenerConfiguracion();
    
    if (isrInput) isrInput.value = config.tasaISR || 30.0;
    if (interesInput) interesInput.value = config.tasaInteres || 19.0;
    if (inflacionInput) inflacionInput.value = config.tasaInflacion || 4.5;
    if (rentaInput) rentaInput.value = config.renta || 2500;
    if (manoObraInput) manoObraInput.value = config.manoObraDirecta || 0.50;
    
    console.log('Configuración cargada:', config);
  }

  // Función optimizada para mostrar anuncios
  function mostrarAnuncio(indiceAnuncio, callback = null) {
    const anuncio = anuncios[indiceAnuncio];
    if (!anuncio) return;

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'anuncio-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease-in;
    `;

    // Crear modal de anuncio
    const modal = document.createElement('div');
    modal.className = `anuncio-modal ${anuncio.tipo}`;
    modal.style.cssText = `
      background: white;
      border-radius: 15px;
      padding: 30px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.7);
      animation: slideIn 0.3s ease-out forwards;
      border: 3px solid ${getTipoColor(anuncio.tipo)};
    `;

    modal.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${anuncio.icono}</div>
      <h3 style="margin: 0 0 15px 0; color: ${getTipoColor(anuncio.tipo)}; font-size: 24px;">${anuncio.titulo}</h3>
      <p style="margin: 0 0 25px 0; color: #666; font-size: 16px; line-height: 1.5;">${anuncio.mensaje}</p>
      <button id="cerrar-anuncio" style="
        background: ${getTipoColor(anuncio.tipo)};
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
      ">¡Entendido!</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: scale(0.7) translateY(-50px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
      }
      #cerrar-anuncio:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);

    // Event listener para cerrar
    const cerrarBtn = modal.querySelector('#cerrar-anuncio');
    const cerrarAnuncio = () => {
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        overlay.remove();
        style.remove();
        if (callback) callback();
      }, 300);
    };

    cerrarBtn.addEventListener('click', cerrarAnuncio);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cerrarAnuncio();
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(cerrarAnuncio, 5000);
  }

  // Función auxiliar para obtener colores por tipo
  function getTipoColor(tipo) {
    const colores = {
      success: '#4CAF50',
      info: '#2196F3',
      warning: '#FF9800',
      error: '#f44336'
    };
    return colores[tipo] || '#2196F3';
  }

  // Guardar configuración económica (OPTIMIZADO)
  function guardarConfiguracion() {
    const nuevaConfig = {
      tasaISR: parseFloat(isrInput.value) || 30.0,
      tasaInteres: parseFloat(interesInput.value) || 19.0,
      tasaInflacion: parseFloat(inflacionInput.value) || 4.5
    };
    
    window.proyectoSalcera.actualizarConfiguracion(nuevaConfig);
    
    // Mostrar anuncio específico para configuración
    mostrarAnuncio(0, () => {
      console.log('Configuración económica guardada correctamente');
    });
  }

  // Guardar costos operativos (OPTIMIZADO)
  function guardarCostos() {
    const nuevaConfig = {
      renta: parseFloat(rentaInput.value) || 2500,
      manoObraDirecta: parseFloat(manoObraInput.value) || 0.50
    };
    
    window.proyectoSalcera.actualizarConfiguracion(nuevaConfig);
    
    // Mostrar anuncio específico para costos
    mostrarAnuncio(1, () => {
      console.log('Costos operativos guardados correctamente');
    });
  }

  // Exportar todos los datos del proyecto (OPTIMIZADO)
  function exportarDatos() {
    window.proyectoSalcera.exportarDatos();
    
    // Mostrar anuncio específico para exportación
    mostrarAnuncio(2, () => {
      console.log('Datos exportados correctamente');
    });
  }

  // Importar datos del proyecto (OPTIMIZADO)
  function importarDatos(event) {
    const file = event.target.files[0];
    if (!file) return;

    window.proyectoSalcera.importarDatos(file)
      .then(() => {
        cargarConfiguracion();
        // Mostrar anuncio específico para importación
        mostrarAnuncio(3, () => {
          console.log('Datos importados correctamente');
        });
      })
      .catch((error) => {
        console.error('Error al importar:', error);
        mostrarMensajeError("Error al importar el archivo: " + error.message);
      });
    
    // Limpiar el input
    event.target.value = '';
  }

  // Mostrar mensajes de error (función separada)
  function mostrarMensajeError(mensaje) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'config-alert error';
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      border-radius: 5px;
      color: white;
      z-index: 1000;
      background-color: #f44336;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    alertDiv.textContent = mensaje;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 4000);
  }

  // Validar inputs en tiempo real (OPTIMIZADO)
  function validarInput(input, min, max, defaultValue) {
    input.addEventListener('blur', function() {
      let valor = parseFloat(this.value);
      
      if (isNaN(valor) || valor < min || valor > max) {
        this.value = defaultValue;
        mostrarMensajeError(`Valor inválido. Se ha restaurado el valor por defecto: ${defaultValue}`);
      }
    });
  }

  // Configurar validaciones
  if (isrInput) validarInput(isrInput, 0, 100, 30.0);
  if (interesInput) validarInput(interesInput, 0, 100, 19.0);
  if (inflacionInput) validarInput(inflacionInput, 0, 50, 4.5);
  if (rentaInput) validarInput(rentaInput, 0, 100000, 2500);
  if (manoObraInput) validarInput(manoObraInput, 0, 100, 0.50);

  // Suscribirse a cambios en el sistema central
  window.proyectoSalcera.suscribir((seccion, datos) => {
    if (seccion === 'configuracion') {
      console.log('Configuración actualizada desde el sistema central:', datos);
    }
  });

  // Event listeners optimizados para los 3 botones principales
  if (guardarConfigBtn) {
    guardarConfigBtn.addEventListener("click", function(e) {
      e.preventDefault();
      guardarConfigBtn.disabled = true; // Prevenir múltiples clics
      guardarConfiguracion();
      setTimeout(() => { guardarConfigBtn.disabled = false; }, 2000);
    });
  }

  if (guardarCostosBtn) {
    guardarCostosBtn.addEventListener("click", function(e) {
      e.preventDefault();
      guardarCostosBtn.disabled = true; // Prevenir múltiples clics
      guardarCostos();
      setTimeout(() => { guardarCostosBtn.disabled = false; }, 2000);
    });
  }

  if (exportarBtn) {
    exportarBtn.addEventListener("click", function(e) {
      e.preventDefault();
      exportarBtn.disabled = true; // Prevenir múltiples clics
      exportarDatos();
      setTimeout(() => { exportarBtn.disabled = false; }, 2000);
    });
  }

  if (importarBtn) {
    importarBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (archivoInput) archivoInput.click();
    });
  }

  if (archivoInput) {
    archivoInput.addEventListener("change", importarDatos);
  }

  // Auto-guardar optimizado con anuncio informativo
  let autoGuardadoMostrado = false;
  const inputs = [isrInput, interesInput, inflacionInput, rentaInput, manoObraInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('change', function() {
        // Mostrar anuncio de auto-guardado solo la primera vez
        if (!autoGuardadoMostrado) {
          setTimeout(() => {
            mostrarAnuncio(4);
            autoGuardadoMostrado = true;
          }, 500);
        }
        
        // Pequeño delay para evitar múltiples guardados
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          if (this === isrInput || this === interesInput || this === inflacionInput) {
            // Auto-guardar sin anuncio para no saturar
            const nuevaConfig = {
              tasaISR: parseFloat(isrInput.value) || 30.0,
              tasaInteres: parseFloat(interesInput.value) || 19.0,
              tasaInflacion: parseFloat(inflacionInput.value) || 4.5
            };
            window.proyectoSalcera.actualizarConfiguracion(nuevaConfig);
          } else {
            // Auto-guardar costos sin anuncio
            const nuevaConfig = {
              renta: parseFloat(rentaInput.value) || 2500,
              manoObraDirecta: parseFloat(manoObraInput.value) || 0.50
            };
            window.proyectoSalcera.actualizarConfiguracion(nuevaConfig);
          }
        }, 1000);
      });
    }
  });

  // Cargar configuración inicial
  cargarConfiguracion();

  console.log('Módulo de configuración optimizado correctamente con sistema de anuncios');
});