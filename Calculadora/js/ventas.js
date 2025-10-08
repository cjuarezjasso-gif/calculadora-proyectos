// js/ventas.js

document.addEventListener("DOMContentLoaded", function () {
  const precioInput = document.getElementById("precio-unitario");
  const unidadesInput = document.getElementById("unidades-iniciales");
  const crecimientoInput = document.getElementById("crecimiento-mercado");
  const calcularBtn = document.getElementById("calcular-ventas");

  const tablaBody = document.getElementById("proyeccion-ventas-body");
  const canvas = document.getElementById("ventas-chart");
  let chart;

  function obtenerInflacion() {
    const inflacionGuardada = localStorage.getItem("inflacion");
    return inflacionGuardada ? parseFloat(inflacionGuardada) / 100 : 0;
  }

  function calcularProyeccion() {
    const precioBase = parseFloat(precioInput.value);
    const unidadesBase = parseFloat(unidadesInput.value);
    const crecimiento = parseFloat(crecimientoInput.value) / 100;
    const inflacion = obtenerInflacion();

    if (isNaN(precioBase) || isNaN(unidadesBase) || isNaN(crecimiento)) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    const anios = 5;
    const data = [];

    for (let i = 0; i < anios; i++) {
      const anio = i + 1;
      const unidades = unidadesBase * Math.pow(1 + crecimiento, i);
      const precioAjustado = precioBase * Math.pow(1 + inflacion, i);
      const ventas = unidades * precioAjustado;

      data.push({
        anio,
        precio: precioAjustado.toFixed(2),
        unidades: unidades.toFixed(0),
        ventas: ventas.toFixed(2),
      });
    }

    document.getElementById("info-inflacion").textContent =
      `Tasa de inflación aplicada: ${(inflacion * 100).toFixed(1)}% anual`;

    mostrarTabla(data);
    graficar(data);
  }

  function mostrarTabla(data) {
    tablaBody.innerHTML = "";
    data.forEach(d => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${d.anio}</td>
        <td>$${d.precio}</td>
        <td>${d.unidades}</td>
        <td>$${d.ventas}</td>
      `;
      tablaBody.appendChild(row);
    });
  }

  function graficar(data) {
    const labels = data.map(d => `Año ${d.anio}`);
    const ventasTotales = data.map(d => d.ventas);

    if (chart) chart.destroy();

    chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Ventas Totales ($)",
          data: ventasTotales,
          backgroundColor: "#4CAF50",
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => `$${value}`
            }
          }
        }
      }
    });
  }

  calcularBtn.addEventListener("click", calcularProyeccion);
});
