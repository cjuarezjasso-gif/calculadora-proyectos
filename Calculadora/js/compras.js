document.getElementById("calcular-compras").addEventListener("click", () => {
  const costoUnitario = parseFloat(document.getElementById("costo-unitario").value);
  const insumosIniciales = parseInt(document.getElementById("insumos-iniciales").value);
  const crecimiento = parseFloat(document.getElementById("crecimiento-insumos").value) / 100;

  const años = 5;
  const datos = [];
  
  for (let i = 0; i < años; i++) {
    const insumos = Math.round(insumosIniciales * Math.pow(1 + crecimiento, i));
    const total = insumos * costoUnitario;
    datos.push({ año: i + 1, insumos, total });
  }

  const tbody = document.getElementById("proyeccion-compras-body");
  tbody.innerHTML = "";
  datos.forEach(d => {
    const fila = `<tr>
      <td>${d.año}</td>
      <td>$${costoUnitario.toFixed(2)}</td>
      <td>${d.insumos}</td>
      <td>$${d.total.toFixed(2)}</td>
    </tr>`;
    tbody.innerHTML += fila;
  });

  // Gráfico
  const ctx = document.getElementById('compras-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(d => `Año ${d.año}`),
      datasets: [{
        label: 'Costo Total de Compras',
        data: datos.map(d => d.total),
        backgroundColor: '#4caf50'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
