async function getCurrency(currency) {
  try {
    const res = await fetch(`https://mindicador.cl/api/${currency}`);
    const data = await res.json();
    return data;
  } catch (e) {
    // Se escribe error en el DOM para el catch
    let domValue = document.getElementById("money-result");
    domValue.innerHTML = `Algo salió mal! Error: ${e.message}`;
  }
}

async function clpValueToCurrency() {
  try {
    let clpValue = document.getElementById("clp-value").value;
    if(clpValue == null || clpValue == undefined || isNaN(parseInt(clpValue))){
      alert('Por favor, ingrese un número válido.')
      return
    }
    console.log(clpValue);
    let selectedCurrency = document.getElementById("selector").options[selector.selectedIndex].value;
    console.log(selectedCurrency);
    let currencyArray = await getCurrency(selectedCurrency);
    console.log(currencyArray.serie[0]);
    let actualValueOfCurrency = currencyArray.serie[0].valor;
    console.log(selectedCurrency);

    // Se calcula el cambio
    result = (parseInt(clpValue) / actualValueOfCurrency).toFixed(4);

    // Se revisa el valor de result, si los decimales son solo 0s se eliminan
    let decimals = result.toString().split(".");
    console.log(decimals);
    if (parseInt(decimals[1]) == 0) {
      result = decimals[0];
    }

    // Se coloca el resultado en el DOM
    let domValue = document.getElementById("money-result");

    // Se coloca el signo correcto para cada tipo de cambio
    if (selectedCurrency == "uf") {
      domValue.innerHTML = `Resultado: ${result} UF`;
    } else if (selectedCurrency == "euro") {
      domValue.innerHTML = `Resultado: € ${result} `;
    } else {
      domValue.innerHTML = `Resultado: $ ${result} `;
    }

    //Se llama la render del grafico
    let lastDaysValuesArray = currencyArray.serie.slice(1, 10);
    renderGrafica(lastDaysValuesArray.reverse());

    console.log(result);
  } catch (e) {
    // Se escribe error en el DOM para el catch
    let domValue = document.getElementById("money-result");
    domValue.innerHTML = `Algo salió mal! Error: ${e.message}`;
  }
  // Obtener la opción seleccionada
}

async function getAndCreateDataToChart(currencyArray) {
  console.log(currencyArray);
  const labels = currencyArray.map((currency) => {
    return currency.fecha.split('T')[0];
  });
  
  const data = currencyArray.map((currency) => {
    const valor = currency.valor;
    return valor;
  });

  const datasets = [
    {
      label: "Historial últimos 10 días",
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
}

async function renderGrafica(lastDaysValuesArray) {
    //Se elimina un chat previo
    const myChartElement = document.getElementById("myChart");

    const existingChart = Chart.getChart(myChartElement);

    // Destruir el gráfico existente si hay uno
    if (existingChart) {
        existingChart.destroy();
    }

    const data = await getAndCreateDataToChart(lastDaysValuesArray);
    const config = {
        type: "line",
        data,
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
}
