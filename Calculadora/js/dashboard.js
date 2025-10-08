// js/dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  // Valores simulados para KPIs
  document.getElementById("tir-value").textContent = "18.5%";
  document.getElementById("van-value").textContent = "$120,000";
  document.getElementById("pri-value").textContent = "2.5 años";
  document.getElementById("cb-value").textContent = "1.75";

  // Flujo de efectivo proyectado
  const cashflowCtx = document.getElementById("cashflow-chart").getContext("2d");
  new Chart(cashflowCtx, {
    type: "line",
    data: {
      labels: ["Año 1", "Año 2", "Año 3", "Año 4", "Año 5"],
      datasets: [{
        label: "Flujo de Efectivo ($)",
        data: [-50000, 30000, 40000, 50000, 60000],
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });

  // Ventas vs Costos
  const salesCostsCtx = document.getElementById("sales-costs-chart").getContext("2d");
  new Chart(salesCostsCtx, {
    type: "bar",
    data: {
      labels: ["Año 1", "Año 2", "Año 3"],
      datasets: [
        {
          label: "Ventas ($)",
          data: [100000, 120000, 140000],
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        },
        {
          label: "Costos ($)",
          data: [60000, 70000, 80000],
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" }
      }
    }
  });

  // Composición de Costos
  const costsBreakdownCtx = document.getElementById("costs-breakdown-chart").getContext("2d");
  new Chart(costsBreakdownCtx, {
    type: "pie",
    data: {
      labels: ["Materia Prima", "Mano de Obra", "Gastos Fijos", "Otros"],
      datasets: [{
        label: "Composición",
        data: [35, 25, 30, 10],
        backgroundColor: [
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)"
        ]
      }]
    },
    options: {
      responsive: true
    }
  });
});
