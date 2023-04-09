/*-----LES VARIABLES GLOBALES---------*/
let listArticles = [];      //liste des articles
let listCat = [];           //liste des catégories
let cart = new Map();       //panier
let total = 0;              //montant total commande
let numCommande = 0;        //numéro d'une commande

/*--------INITIALISATION DES DATAS + AFFICHAGE SUR LA PAGE---------*/
function initArticles(){
    listArticles.push(new Article(1,"S8","Samung",200,0,1));
    listArticles.push(new Article(2,"S9","Samung",250,0,1));
    listArticles.push(new Article(3,"Iphone 10","Apple",500,0,1));
    listArticles.push(new Article(4,"GalaxyTab","Samung",300,0,2));
    listArticles.push(new Article(5,"EliteBook","HP",1000,0,3));
    listArticles.push(new Article(6,"Macbook","Apple",1500,0,3));

    displayArticles(listArticles);  //une fois seulement les données reçues, on les affiche !
    addListenTable();               //association des évènements aux cellules du tableau
}
function initCategories() {
    listCat.push(new Categorie(0,"All","Tous les articles"));
    listCat.push(new Categorie(1,"SmartPhone","Téléphone mobile"));
    listCat.push(new Categorie(2,"Tablet","Tablette tactile"));
    listCat.push(new Categorie(3,"Pc","Ordinateur fixe ou portable"));

    displayCategories();
}
//affichage de la liste des articles sur la page
function displayArticles(listArt) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ' ';
    if(listArticles.length > 0){
        for (let art of listArt) {
            const ligne = tbody.insertRow();
            let celId = ligne.insertCell();     celId.innerHTML = art.getId();
            let celName = ligne.insertCell();   celName.innerHTML = art.getName();
            let celBrand = ligne.insertCell();  celBrand.innerHTML = art.getBrand();
            let celPrice = ligne.insertCell();  celPrice.innerHTML = art.getPrice();
            let celQuantity = ligne.insertCell();
            let quantity = 0;
            let p;
            if(cart != null) p = cart.get(art.id);
            if(p)   quantity = p.getQuantity();
            celQuantity.innerHTML = `<input class="quantity" type="number" value="` + quantity +`" min="0" max="10">`;
        } 
    }
    else danger(tbody);
}
//affichage des catégories sur la page
function displayCategories(){
    const cat = document.getElementById("categories");
    if(listCat.length > 0){        
        cat.innerHTML = '';        
        listCat.forEach(c => {
            cat.innerHTML += `<a href="#" onclick="notify(this)" class="list-group-item">` + c.getName() +  `</a>`;
        })
    }
    else danger(cat);
}

/*-----------GESTION DES EVENEMENTS DE L'APPLICATION------*/
//association évènements sur changement quantité d'un article -> panier modifié
function addListenTable(){
    const cells = document.getElementsByClassName("quantity");    
     for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('change', (event) => {  
            let index = Array.from(document.getElementsByClassName("quantity")).findIndex(e => e === event.target); //récupération de l'index de la ligne concernée
        
            let article = listArticles[index];
            article.setQuantity(document.getElementsByClassName("quantity")[index].value);
            addCart(article);
            displayCart();
        });
    }
}
//association évènements sur clic bouton Suivant s'agissant d'une commande : formulaire + validation
function addListenCde(){
    let btn = document.getElementById("commande");
    btn.addEventListener('click',function(){
        document.getElementById("btncom").style.display= "block";
        document.getElementById("confirmer").style.display= "none";        
        document.getElementById("infos").style.display= "block";
    });
} 

/*-----------GESTION DES INTERACTIONS AVEC L'UTILISATEUR----------*/
//Vide le panier de tous les éléments qui ont 0 articles
function scanCart() {
    cart.forEach((p) => {
        if(p.getQuantity() == 0)    cart.delete(p.getId());
    });
}
//Affiche le contenu de mon panier
function displayCart() {
    let elem = document.getElementById("cad");
    total = 0;
    scanCart();
    if(cart.size > 0 ) {
        elem.innerHTML = '';
        
        cart.forEach((p) => {        
            elem.innerHTML += "<p>" + p.toString() + " " + "Quantité : " + p.getQuantity() + "</p>";
            total += p.price * p.quantity;
        });
        elem.innerHTML += "<strong>" + "prix total de la commande : " + total + "</strong>";
        document.getElementById("commande").style.display= "block";
    }  
    else document.getElementById("commande").style.display= "none";
}
//A chaque rajout d'un article on change la quantité s'il existe déjà ou on le crée
function addCart(article) {
    let p = cart.get(article.id);

    if (p) {
        cart.get(article.id).setQuantity(article.getQuantity());
    }
    else {
        let newArticle = new Article(article.id, article.name, article.brand, article.price, article.quantity);
        cart.set(article.id, newArticle);
    }
}

//Affichage de tous les articles d'une catégorie
function articlesByIdCat(id){
    listArtsById = [];
    if(id == 0) displayArticles(listArticles);
    else {
            listArticles.forEach( p => {
            if(p.getCategorie() == id) listArtsById.push(p);
        })  
        displayArticles(listArtsById);
    }
    addListenTable();
}
//gestion liée à l'activation d'une catégorie cliqué
function notify(elem) {
    resetElements();
    elem.classList.add('active');
    listCat.forEach(c => {
        if(c.name == elem.innerHTML)  articlesByIdCat(c.getId());
    })
}  
function resetElements() {
    const els = document.getElementsByClassName("active");
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('active')
    }
}

//Affichage de la confirmation de commande
function displayOrder(){
    let elem = document.getElementById("conf");
    let order = JSON.parse(localStorage.getItem('order'));

    if(order){
        elem.innerHTML = '';        
        elem.innerHTML += "<p>" + "<strong>" + " ID COMMANDE : " + order.id + "</strong> </p>";
        elem.innerHTML += "<p>" + "<strong>" + " DATE : "        + order.date.toLocaleString() + "</strong> </p>";
        elem.innerHTML += "<p>" + "<strong>" + " TOTAL : "       + order.amount + "</strong> </p>";
        elem.innerHTML += "<p>" + "<strong>" + " NOM CLIENT : "  + order.customer.name + "</strong> </p>";
        elem.innerHTML += "<br>";
        elem.innerHTML += "RECAP DE LA COMMANDE :";
        order.articleItems.forEach((p) => {        
            elem.innerHTML += "<p>" + p.name + " " + "Quantité : " + p.quantity + "</p>";
        });
        document.getElementById("confirmer").style.display= "block";
        document.getElementById("btncom").style.display= "none";
    }
    else {
         danger(elem);
         document.getElementById("confirmer").style.display= "block";
    }
}

//passer une commande après saisi des infos sur le formulaire
function order(){
    if(confirm("vous êtes sur de vouloir valider la commande ?")){
        let name = document.getElementById("name").value;
        let address = document.getElementById("address").value;
        let phone = document.getElementById("phoneNumber").value;
        let email = document.getElementById("email").value;

        let customer = new Customer(name,address,phone,email);
        
        let articleItems = [];
        cart.forEach(p => {
            let pi = new ArticleItem(p.getId(),p.getName(),p.getQuantity());
            articleItems.push(pi);
        })

        //ajouter un cookie pour le numéro de la commande ou local storage
        let order = new Order(++numCommande,new Date(),total, customer, articleItems);

        localStorage.setItem('order' , JSON.stringify(order));  //stockage de la commande dans le local storage
        cart.clear();
        document.getElementById("commande").style.display= "none";
        document.getElementById("infos").style.display= "none";

        setTimeout( () => displayOrder(),3000);
    }
}

//En cas de pb, message d'erreur
//Au passage, autre manière de modifier notre page html
function danger(elem){      //ToDo : améliorer la gestion d'une erreur
    let msg = document.createTextNode('PROBLEM CHARGEMENT DES DONNEES');
    elem.style.color = 'red';
    elem.append(msg);
}

// Init des "composants"
function shop() {
    initArticles();
    initCategories();    
    addListenCde();
}

//lancement de notre appli
shop();