async function fetchDataFromAPI(){
    try{
        const res = await fetch("https://mindicador.cl/api/");
        const data = await res.json();
        //console.log(data);
        return data
    }catch(e){
        alert(e.message);
    }
}

// async function fetchIndicatorsFromAPI(){
//     let indicatorsObject = [];
//     try{
//         const res = await fetch("https://mindicador.cl/api/").then(function(response){
//             let indicator = {};
//             indicator.nombre = response.uf.nombre;
//             indicator.valor = response.uf.valor;
//             indicatorsObject.push(indicator)
//         });
//     }catch(e){
//         alert(e.message);
//     }
//     console.log(indicatorsObject)
// }

// fetchIndicatorsFromAPI();

async function getCurrency(currency){
    try{
        const res = await fetch(`https://mindicador.cl/api/${currency}`);
        const data = await res.json();
        return data
    }catch(e){
        alert(e.message);
    }
}

async function clpValueToCurrency(){
    try{
        let clpValue = document.getElementById('clp-value').value;
        console.log(clpValue)
        let selectedCurrency = document.getElementById('selector').options[selector.selectedIndex].value;
        console.log(selectedCurrency)
        let currencyArray = await getCurrency(selectedCurrency);
        console.log(currencyArray.serie[0])
        let actualValueOfCurrency = currencyArray.serie[0].valor;
        console.log(selectedCurrency)
        
        // Switch para determinar que hacer
        switch(selectedCurrency){
            case 'uf':
                result = (parseInt(clpValue)/actualValueOfCurrency).toFixed(4);
                break;
            case 'bitcoin':
                result = (parseInt(clpValue)/actualValueOfCurrency).toFixed(4);
                break;
            case 'euro':
                result = (actualValueOfCurrency * parseInt(clpValue)).toFixed(4);
                break;
            case 'dolar':
                result = (actualValueOfCurrency * parseInt(clpValue)).toFixed(4);
                break;
            case 'dolar_intercambio':
                result = (actualValueOfCurrency * parseInt(clpValue)).toFixed(4);
                break;
        }
        
        // Se revisa el valor de result, si los decimales son solo 0s se eliminan
        let decimals = result.toString().split('.')
        console.log(decimals)
        if(parseInt(decimals[1]) == 0){
            result = decimals[0];
        }

        // Se coloca el resultado en el DOM
        let domValue = document.getElementById('money-result');
        domValue.innerHTML= result;

        console.log(result)
        
    } catch(e){
        alert(e.message)
    }
// Obtener la opción seleccionada
}
