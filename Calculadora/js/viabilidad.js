document.getElementById('calcular-viabilidad').addEventListener('click', function () {
  const inversionInicial = parseFloat(document.getElementById('inversion-inicial').value);
  const horizonte = parseInt(document.getElementById('horizonte').value);
  const tasaDescuento = parseFloat(document.getElementById('tasa-descuento').value) / 100;

  // Simulamos ingresos y costos anuales
  let flujoCaja = [];
  for (let i = 1; i <= horizonte; i++) {
    const ingresos = 50000 + (i - 1) * 10000; // Aumenta ingresos cada año
    const costos = 20000 + (i - 1) * 5000;    // Aumenta costos cada año
    const neto = ingresos - costos;
    flujoCaja.push({ año: i, ingresos, costos, neto });
  }

  // Calcular VAN
  let van = -inversionInicial;
  flujoCaja.forEach((flujo, i) => {
    van += flujo.neto / Math.pow(1 + tasaDescuento, i + 1);
  });

  // Calcular TIR (búsqueda numérica simple)
  function calcularTIR(cashFlows) {
    let tasa = 0.01;
    let tir = 0;
    for (; tasa < 1; tasa += 0.0001) {
      let npv = -inversionInicial;
      for (let i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + tasa, i + 1);
      }
      if (npv <= 0) {
        tir = tasa;
        break;
      }
    }
    return tir;
  }

  // Calcular PRI (Payback Period)
  let acumulado = -inversionInicial;
  let pri = 0;
  for (let i = 0; i < flujoCaja.length; i++) {
    acumulado += flujoCaja[i].neto;
    if (acumulado >= 0) {
      pri = i + 1;
      break;
    }
  }

  // Mostrar resultados
  document.getElementById('van-resultado').textContent = `$${van.toFixed(2)}`;
  document.getElementById('tir-resultado').textContent = `${(calcularTIR(flujoCaja.map(f => f.neto)) * 100).toFixed(2)}%`;
  document.getElementById('pri-resultado').textContent = `${pri} años`;

  // Llenar tabla
  const tbody = document.getElementById('flujo-caja-body');
  tbody.innerHTML = '';
  flujoCaja.forEach(f => {
    const row = `
      <tr>
        <td>${f.año}</td>
        <td>$${f.ingresos.toFixed(2)}</td>
        <td>$${f.costos.toFixed(2)}</td>
        <td>$${f.neto.toFixed(2)}</td>
      </tr>`;
    tbody.innerHTML += row;
  });

  // Graficar
  const ctx = document.getElementById('viabilidad-chart').getContext('2d');
  if (window.viabilidadChart) {
    window.viabilidadChart.destroy();
  }

  window.viabilidadChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: flujoCaja.map(f => `Año ${f.año}`),
      datasets: [{
        label: 'Flujo Neto',
        data: flujoCaja.map(f => f.neto),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
