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

async function getAllCurrencies(){
    const allData = await fetchDataFromAPI();
    const select = document.getElementById('selector');
    
    console.log(allData) // quitar
    for(element in allData){
        if(typeof allData[element] === 'object'){
            console.log(allData[element]['nombre']) // quitar
            select.innerHTML += `<option>${allData[element]['nombre']}</option>`
        }
    }
    
}

getAllCurrencies();