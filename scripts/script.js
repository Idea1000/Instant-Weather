function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 

function update() {
    postal = document.getElementById("code").value.toString();
    if (postal.length == 5 && postal != lastPostal) {
        getCommunes(postal);
        lastPostal = postal;
    }
}

function getCommunes(postal) {
    select = document.getElementById("comm");
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
        select.hidden = false;
    }).catch(error => {
        console.error("Une erreur s'est produite :", error);
    });
}

document.getElementById("code").addEventListener("keyup", update);
const gouvURL = 'https://geo.api.gouv.fr/communes';
let lastPostal = "0";