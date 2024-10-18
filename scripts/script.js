//local storage setting
if (localStorage.getItem('cyclone_weather_lat') == null) {
    localStorage.setItem('cyclone_weather_lat',  JSON.stringify(false));
}

if (localStorage.getItem('cyclone_weather_lon') == null) {
    localStorage.setItem('cyclone_weather_lon',  JSON.stringify(false));
}

if (localStorage.getItem('cyclone_weather_cumul') == null) {
    localStorage.setItem('cyclone_weather_cumul',  JSON.stringify(false));
}

if (localStorage.getItem('cyclone_weather_vent') == null) {
    localStorage.setItem('cyclone_weather_vent',  JSON.stringify(false));
}

if (localStorage.getItem('cyclone_weather_dirvent') == null) {
    localStorage.setItem('cyclone_weather_dirvent',  JSON.stringify(false));
}

if (localStorage.getItem('cyclone_weather_day') == null) {
    localStorage.setItem('cyclone_weather_day',  1);
}

let latitude = JSON.parse(localStorage.getItem('cyclone_weather_lat'));
let longitude = JSON.parse(localStorage.getItem('cyclone_weather_lon'));
let cumul = JSON.parse(localStorage.getItem('cyclone_weather_cumul'));
let vent = JSON.parse(localStorage.getItem('cyclone_weather_vent'));
let direction = JSON.parse(localStorage.getItem('cyclone_weather_dirvent'));
let dayRequested = JSON.parse(localStorage.getItem('cyclone_weather_day'));

document.getElementById("latAvis").checked = latitude;
document.getElementById("longAvis").checked = longitude;
document.getElementById("cumulAvis").checked = cumul;
document.getElementById("ventAvis").checked = vent;
document.getElementById("directionAvis").checked = direction;
document.getElementById("jourSouhait").value = dayRequested;

//fin local storage setting

/**
 * met à jour les paramètres en rapport avec les paramètres choisi
 */
function updateSetting() {
    localStorage.setItem('cyclone_weather_lat',  JSON.stringify(document.getElementById("latAvis").checked));
    localStorage.setItem('cyclone_weather_lon',  JSON.stringify(document.getElementById("longAvis").checked));
    localStorage.setItem('cyclone_weather_cumul',  JSON.stringify(document.getElementById("cumulAvis").checked));
    localStorage.setItem('cyclone_weather_vent',  JSON.stringify(document.getElementById("ventAvis").checked));
    localStorage.setItem('cyclone_weather_dirvent',  JSON.stringify(document.getElementById("directionAvis").checked));
    localStorage.setItem('cyclone_weather_day',  document.getElementById("jourSouhait").value);

    latitude = JSON.parse(localStorage.getItem('cyclone_weather_lat'));
    longitude = JSON.parse(localStorage.getItem('cyclone_weather_lon'));
    cumul = JSON.parse(localStorage.getItem('cyclone_weather_cumul'));
    vent = JSON.parse(localStorage.getItem('cyclone_weather_vent'));
    direction = JSON.parse(localStorage.getItem('cyclone_weather_dirvent'));
    dayRequested = JSON.parse(localStorage.getItem('cyclone_weather_day'));
}

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
 * créer une notification avec le texte souhaité (supprime la notification actuel si il y en a une)
 * @param {String} texte 
 */
function createNotification(texte) {
    notification.classList.remove("is-hidden");
    let saveButton = document.createElement("div");
    saveButton.classList.add("delete");

    saveButton.addEventListener('click', () => {
        notification.classList.add("is-hidden");
    });

    notification.children[0].children[0].innerHTML = texte;
    notification.children[0].children[0].appendChild(saveButton);
}

/**
 * insere les communes listé avec le code postal donné dans le select donné
 * @param {String} postal 
 * @param {document.select} select
 */
function getCommunes(postal, select) {
    if (isNaN(postal)) {
        //si le code postal donnée contient un caractère qui n'est pas un nombre
        createNotification(`le code postal <strong>"${postal}"</strong> n'est pas valide`);
    } else {
        fetch(`https://geo.api.gouv.fr/communes?codePostal=${postal}&fields=nom,code,codePostal`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            return response.json(); // Convertit la réponse en JSON
        }).then(data => {
            //console.log("Communes récupérées :", data);
            console.log(`${data.length} communes récupéré avec le code postal ${postal}`);
            if (data.length > 0) {
                removeOptions(select);
                data.forEach(commune => {
                    //console.log(`Commune: ${commune.nom}, Code INSEE: ${commune.code}`);
                    let opt = document.createElement('option');
                    opt.value = commune.code;
                    opt.innerHTML = commune.nom;
                    select.appendChild(opt);
                });
                document.getElementById("selectCommuneDiv").classList.remove("is-hidden");
                document.getElementById("labelSelect").classList.remove("is-hidden");
                document.getElementById("valider").classList.remove("is-hidden");
            } else {
                createNotification(`Aucune commune trouvée pour le code postal <strong>${postal}</strong>`);
            }
        }).catch(error => {
            console.error("Une erreur s'est produite :", error);
        });
    }
}

/**
 * retourne la date du jour + days
 * @param {int} days 
 * @returns 
 */
function ajouteJours (days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * change l'affichage de la météo selon le jour choisit
 * @param {int} jour le nombre de jour depuis aujourd'hui
 */
function updateMeteo(jour, container) {
    let card = container.children[0];
    updateIcon(meteo[jour].weather, card.children[0].querySelector("#Emoji"));
    card.children[0].querySelector("#Tmin").textContent = `Température minimale ${meteo[jour].tmin}°C`;
    card.children[0].querySelector("#Tmax").textContent = `Température maximale ${meteo[jour].tmax}°C`;
    card.children[0].querySelector("#Ppluie").textContent = `Probabilité de pluie ${meteo[jour].probarain}%`;
    card.children[0].querySelector("#Ejour").textContent = `Ensoleillement du jour ${meteo[jour].sun_hours}h`;

    card.children[1].querySelector("#option").classList.add("is-hidden");
    card.children[1].querySelector("#latitude").classList.add("is-hidden");
    card.children[1].querySelector("#longitude").classList.add("is-hidden");
    card.children[1].querySelector("#cumul").classList.add("is-hidden");
    card.children[1].querySelector("#wind").classList.add("is-hidden");
    card.children[1].querySelector("#dirwind").classList.add("is-hidden");

    var today = ajouteJours(jour);
    var j = String(today.getDate()).padStart(2, '0');
    var a = today.getFullYear();
    dateRetour = JOUR[today.getDay()] + " " + j + " " + MOIS[today.getMonth()] + " " + a;
    container.children[1].innerText = dateRetour;
    
    if ( ( ( latitude || longitude ) || ( cumul || (vent || direction ) ) ) ) {
        //option ?
        card.children[1].querySelector("#option").classList.remove("is-hidden");

        if (latitude) {
            card.children[1].querySelector("#latitude").classList.remove("is-hidden");
            card.children[1].querySelector("#latitude").textContent = `Latitude ${meteo[jour].latitude}`;
        }
        if (longitude) {
            card.children[1].querySelector("#longitude").classList.remove("is-hidden");
            card.children[1].querySelector("#longitude").textContent = `Longitude ${meteo[jour].longitude}`;
        }
        if (cumul) {
            card.children[1].querySelector("#cumul").classList.remove("is-hidden");
            card.children[1].querySelector("#cumul").textContent = `Cumul`;
        }
        if (vent) {
            card.children[1].querySelector("#wind").classList.remove("is-hidden");
            card.children[1].querySelector("#wind").textContent = `Vent moyen ${meteo[jour].wind10m}km/h`;
        }
        if (direction) {
            card.children[1].querySelector("#dirwind").classList.remove("is-hidden");
            card.children[1].querySelector("#dirwind").textContent = `Direction du vent ${meteo[jour].dirwind10m}°`;
        }
    }
}

/**
 * met à jour les cartes à l'aide de la variable meteo
 */
function meteoRequest() {
    // enlever toutes les cartes
    while (document.getElementById("resultC").children.length > 1) {
        document.getElementById("resultC").removeChild(document.getElementById("resultC").lastChild);
    }
    // ajouter toutes les cartes
    for (i = 0; i < dayRequested; i++) {
        let carte = document.getElementById("origine").content.cloneNode(true);
        updateMeteo(i, carte.children[0].children[0]);
        document.getElementById("resultC").appendChild(carte);
    }
}

/**
 * recupere les données météo pour ce code INSEE
 * @param {*} insee 
 */
function getMeteo(insee) {
    if (insee != lastInsee) {
        document.getElementById("valider").classList.add("is-loading");
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
            meteoRequest();
        }).catch(error => {
            console.error("Une erreur s'est produite :", error);
        });
        lastInsee = insee;
        document.getElementById("valider").classList.remove("is-loading");
    }
}

/**
 * modifie l'icône en fonction du paramètre weather
 * @param {int} weather paramètre weather de la météo
 */
function updateIcon(weather, element) {
    if (weather < 4) {
        element.innerHTML = `<em class="fa-sun fa-solid">`;
    } else if (weather < 6) {
        element.innerHTML = `<em class="fa-cloud-sun fa-solid">`;
    } else if (weather < 10) {
        element.innerHTML = `<em class="fa-cloud fa-solid">`;
    } else if (weather < 12 || weather == 16) {
        element.innerHTML = `<em class="fa-cloud-rain fa-solid">`;
    } else if ((weather > 16 && weather <22) || (weather > 39 && weather < 79)) {
        element.innerHTML = `<em class="fa-cloud-showers-heavy fa-solid">`;
    } else if (weather > 99 && weather < 143) {
        element.innerHTML = `<em class="fa-cloud-bolt fa-solid">`;
    } else if (weather < 212) {
        element.innerHTML = `<em class="fa-cloud-sun-rain fa-solid">`;
    } else {
        element.innerHTML = `<em class="fa-snowflake fa-solid">`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cp").value = "";
});

document.getElementById("cp").addEventListener("keyup", update);
document.getElementById("valider").addEventListener("click", () => {
    getMeteo(document.getElementById("selectCommune").value);
})

const JOUR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const APITOKEN = '7e4130a5c51e4c071da97d29828bea60cf0091b53ca00d105a0b79bd54bd803d';

let lastPostal = "0"; //sécurité anti spam de requêtes
let lastInsee = "0"; //sécurité anti spam de requêtes
let meteo; //sauvegarde des informations de météo
let notification = document.getElementById("notification");

//setting
let settingOpen = false;
document.getElementById("settingIcon").addEventListener("click", () => {
    if (settingOpen) {
        document.getElementById("settingPage").classList.add("is-hidden");
        settingOpen = false;
    } else {
        document.getElementById("settingPage").classList.remove("is-hidden");
        settingOpen = true;
    }
});
document.getElementById("applySetting").addEventListener("click", () => {
    updateSetting();

    if (meteo != null) {
        meteoRequest();
    }

    //fermer setting
    document.getElementById("settingPage").classList.add("is-hidden");
    settingOpen = false;
});