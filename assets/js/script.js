// Funcion que obtiene la data de la divisa seleccionada desde la API
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

// Funcion que se gatilla desde el DOM
async function clpValueToCurrency() {
  try {

    // Se verifica si el campo de pesos tiene valor y que sea numerico
    let clpValue = document.getElementById("clp-value").value;
    if(clpValue == null || clpValue == undefined || isNaN(parseInt(clpValue))){
      alert('Por favor, ingrese un número válido.');
      return
    }

    // Se obtiene el valor de la divisa a convertir seleccionada
    let selectedCurrency = document.getElementById("selector").options[selector.selectedIndex].value;
    // Se almacena la respuesta y se asigna el valor de la divisa
    let currencyArray = await getCurrency(selectedCurrency);
    let actualValueOfCurrency = currencyArray.serie[0].valor;

    // Se calcula el cambio
    result = (parseInt(clpValue) / actualValueOfCurrency).toFixed(4);

    // Se revisa el valor de result, si los decimales son solo 0s se eliminan (para que no quede el valor X.000)
    let decimals = result.toString().split(".");
    if (parseInt(decimals[1]) == 0) {
      result = decimals[0];
    }

    // Se coloca el resultado en el DOM
    let domValue = document.getElementById("money-result");

    // Se coloca el signo correcto para cada tipo de cambio (esto agrega al DOM el UF, $ o Euro segun corresponda)
    if (selectedCurrency == "uf") {
      domValue.innerHTML = `Resultado: ${result} UF`;
    } else if (selectedCurrency == "euro") {
      domValue.innerHTML = `Resultado: € ${result} `;
    } else {
      domValue.innerHTML = `Resultado: $ ${result} `;
    }

    //Se llama la render del grafico con la data de los ultimos 10 dias
    let lastDaysValuesArray = currencyArray.serie.slice(0, 10);
    renderGraph(lastDaysValuesArray.reverse());

  } catch (e) {
    // Se escribe error en el DOM para el catch
    let domValue = document.getElementById("money-result");
    domValue.innerHTML = `Algo salió mal! Error: ${e.message}`;
  }
}

// Funcion que parsea la data de la divisa para dibujar en el grafico
async function getDataToChart(currencyArray) {
  // Se obtienen las fechas del array de valores de la divisa correspondiente
  const labels = currencyArray.map((currency) => {
    return currency.fecha.split('T')[0];
  });

  // Se obtiene el array de valores de la divisa correspondiente a los ultimos 10 dias
  const data = currencyArray.map((currency) => {
    const valor = currency.valor;
    return valor;
  });

  // Se define el dataset
  const datasets = [
    {
      label: "Historial últimos 10 días",
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
}

// Funcion que agrega el grafico al DOM
async function renderGraph(lastDaysValuesArray) {
    //Se elimina el grafico anterior (si lo hubiese)
    const myChartElement = document.getElementById("myChart");
    const existingChart = Chart.getChart(myChartElement);

    // Destruir el gráfico existente (si hay uno, esto para evitar un error de sobreescribir el chart)
    if (existingChart) {
        existingChart.destroy();
    }

    // Se obtiene la data del char y se define su configuracion
    const data = await getDataToChart(lastDaysValuesArray);
    const config = {
        type: "line",
        data,
    };

    // Se agrega el chart al DOM
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
}
