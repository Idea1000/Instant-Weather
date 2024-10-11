/**
 * retire toutes les options d'un select
 * @param {document.select} selectElement 
 */
function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 
/**
 * met à jour la liste des communes
 */
function update() {
    postal = document.getElementById("cp").value.toString();
    if (postal.length == 5 && postal != lastPostal) {
        getCommunes(postal, document.getElementById("selectCommune")); //modifier ici l'id du select
        lastPostal = postal;
    }
}

/**
 * insere les communes listé avec le code postal donné dans le select donné
 * @param {String} postal 
 * @param {document.select} select
 */
function getCommunes(postal, select) {
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${postal}&fields=nom,code,codePostal`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        return response.json(); // Convertit la réponse en JSON
    }).then(data => {
        //console.log("Communes récupérées :", data);
        console.log(`${data.length} communes récupéré avec le code postal ${postal}`);
        removeOptions(select);
        data.forEach(commune => {
            //console.log(`Commune: ${commune.nom}, Code INSEE: ${commune.code}`);
            let opt = document.createElement('option');
            opt.value = commune.code;
            opt.innerHTML = commune.nom;
            select.appendChild(opt);
        });
        document.getElementById("selectCommuneDiv").classList.remove("is-hidden");
        document.getElementById("selectCommuneDiv").style.transition = "all 2s";
        document.getElementById("labelSelect").classList.remove("is-hidden");
        document.getElementById("valider").classList.remove("is-hidden");
    }).catch(error => {
        console.error("Une erreur s'est produite :", error);
    });
}

/**
 * recupere les données météo pour ce code INSEE
 * @param {*} insee 
 */
function getMeteo(insee) {
    if (insee != lastInsee) {
        console.log(`https://api.meteo-concept.com/api/forecast/daily?token=${APITOKEN}&insee=${insee}`);
        fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${APITOKEN}&insee=${insee}`)
        .then(response => {
            console.log("Response headers: ", response.headers);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            return response.json(); // Convertit la réponse en JSON
        }).then(data => {
            console.log(data['forecast']);
            meteo = data['forecast'];
            document.createElement("div")
            document.getElementById("result").classList.remove("is-hidden");
            updateMeteo(0);
        }).catch(error => {
            console.error("Une erreur s'est produite :", error);
            console.log(`https://api.meteo-concept.com/api/forecast/daily?token=${APITOKEN}&insee=${insee}`);
        });
        lastInsee = insee;
    }
}

function updateMeteo(jour) {
    document.getElementById("Tmin").textContent = `Température minimale ${meteo[0].tmin}°C`;
    document.getElementById("Tmax").textContent = `Température maximale ${meteo[0].tmax}°C`;
    document.getElementById("Ppluie").textContent = `Probabilité de pluie ${meteo[0].probarain}%`;
    document.getElementById("Ejour").textContent = `Ensoleillement du jour ${meteo[0].sun_hours}h`;
    updateIcon(meteo[0].weather);
}

function updateIcon(weather){
    if(weather <4){
        document.getElementById("Emoji").innerHTML =`<em class="fa-sun fa-solid">`;
    }else if(weather <6){
        document.getElementById("Emoji").innerHTML = `<em class="fa-cloud-sun fa-solid">`;
    }else if(weather <10){
        document.getElementById("Emoji").innerHTML = `<em class="fa-cloud fa-solid">`;
    }else if(weather <12 || weather == 16){
        document.getElementById("Emoji").innerHTML = `<em class="fa-cloud-rain fa-solid">`;
    }else if((weather >16 && weather <22) || (weather > 39 && weather <79)){
        document.getElementById("Emoji").innerHTML = `<em class="fa-cloud-showers-heavy fa-solid">`;
    }else if(weather >99 && weather <143){
        document.getElementById("Emoji").innerHTML = `<em class="fa-cloud-bolt fa-solid">`;
    }else if(weather <212){
        document.getElementById("Emoji").innerHTML = `<em class="fa-cloud-sun-rain fa-solid">`;
    }else {
        document.getElementById("Emoji").innerHTML = `<em class="fa-snowflake fa-solid">`;
    }
}

document.getElementById("cp").addEventListener("keyup", update);
document.getElementById("valider").addEventListener("click", () => {
    getMeteo(document.getElementById("selectCommune").value);
})
const APITOKEN = '7e4130a5c51e4c071da97d29828bea60cf0091b53ca00d105a0b79bd54bd803d';
let lastPostal = "0"; //sécurité anti spam de requêtes
let lastInsee = "0";

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("cp").value = "";
});

let meteo;