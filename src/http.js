
let host = "http://localhost:8888";     // url-back : une fois le back en ligne, changer juste ici

/*-----------COMMUNICATION AVEC LE BACK------------------*/

//Méthode d'envoi de requete vers le back afin de solliciter les services web et alimenter nos variables globales
async function getData(url) {  //les mots clés async et await imposent d'attendre de recevoir 
                                //toutes les données avant toute autre action
    try { //traitement consistant à saisir des exceptions/erreurs levés dans ce bloc,
          //combiné avec catch afin de les capturer
        let response = await fetch(host + url);    //envoi de la requete au serveur
        if(response.ok){                    //si reponse valide
            let data = await response.json(); // alors conversion des données en json puis stockage dans data
            return data;
        } else {
            console.error('Retour du serveur : ',response.status)
        }
    } catch (err) {
            console.log(err)
    }
    return null;
}

async function postData(url,options) {
    try {
        let response = await fetch(host+url,options)
        if(response.ok){
            let data = await response.text();
            return data;
        } else {
            console.error('Retour du serveur : ',response.status)    
        }
    } catch (err) {
        console.log(err)
    }
    return null;
}
