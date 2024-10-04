function update() {
    postal = document.getElementById("code").value.toString();
    if (postal.length == 5) {
        document.getElementById("res").innerText = postal;
        getCommunes(postal);
    }
}

function getCommunes(postal) {
    console.log(`https://geo.api.gouv.fr/communes?codePostal=${postal}&fields=nom,code,codePostal`);
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${postal}&fields=nom,code,codePostal`).then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        return response.json(); // Convertit la réponse en JSON
    }).then(data => {
        console.log("Communes récupérées :", data);
        // Tu peux ici manipuler les données renvoyées
        data.forEach(commune => {
            console.log(`Commune: ${commune.nom}, Code INSEE: ${commune.code}`);
        });
    }).catch(error => {
        console.error("Une erreur s'est produite :", error);
    });
}

document.getElementById("code").addEventListener("keyup", update);
const gouvURL = 'https://geo.api.gouv.fr/communes';