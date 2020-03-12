
/*-----LES VARIABLES GLOBALES---------*/
let listProduct = [];       //liste des produits
let listCat = [];           //liste des catégories
let caddy = new Map();      //caddy ou panier
let total = 0;              //montant total commande

//Represente un produit minifié servant à une commande, utile côté back pour associer une commande avec les produits concernés
class ProductItem {
    constructor(id,name,quantity){
        this.id = id;   this.name = name; this.quantity = quantity;
    }
}
//Represente un produit
class Product {
    constructor(id, name, brand, price, quantity) {
        this.id = id;   this.name = name;   this.brand = brand;   this.price = price;   this.quantity = quantity;
    }

    getId() { return this.id; }
    getName() { return this.name; }
    getBrand() { return this.brand; }
    getPrice() { return this.price; }
    getQuantity() { return this.quantity; }
    setQuantity(quantity) { this.quantity = quantity; }

    toString() {
        return " id:" + this.id + " " + this.name + " " + this.brand + " " + this.price + "€";
    }
}
//Represente une catégorie
class Categorie {
    constructor(id, name, description) {
        this.id = id;   this.name = name;   this.description = description;
    }
    getId() { return this.id; }
    getName() { return this.name; }
    getDescription() { return this.description }

    toString() {
        return " id:" + this.id + " " + this.name + " " + this.description;
    }
}

//Renvoi la liste des produits contenu en base via api rest
function getProducts(service){
    getData(service).then(data => {
            listProduct = [];
            if(data != null)   data.forEach(prod => {                
                let p = new Product(prod.id,prod.name,prod.brand,prod.price,0);
                listProduct.push(p); 
        });
        displayProducts();  //une fois seulement les données reçues, on les affiche !
        addListenTable();
    })      
}

//Renvoi la liste des catégories contenu en base 
function getCategories(service){
    getData(service).then(data => {
            listCat = [];   
            if(data != null)   data.forEach(cat => {                
                let c = new Categorie(cat.id,cat.name,cat.description);
                listCat.push(c); 
        });
        displayCategories();
    })      
}

//Création et affichage d'un tableau de produits
function displayProducts() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ' ';

    if(listProduct.length > 0){
        for (let prod of listProduct) {
            const ligne = tbody.insertRow();

            let celId = ligne.insertCell();
            celId.innerHTML = prod.getId();

            let celName = ligne.insertCell();
            celName.innerHTML = prod.getName();
            
            let celBrand = ligne.insertCell();
            celBrand.innerHTML = prod.getBrand();

            let celPrice = ligne.insertCell();
            celPrice.innerHTML = prod.getPrice();

            let celQuantity = ligne.insertCell();
            let quantity = 0;
            let p;
            if(caddy != null) p = caddy.get(prod.id);
            if(p)   quantity = p.getQuantity();
            celQuantity.innerHTML = `<input class="quantity" type="number" value="` + quantity +`" min="0" max="10">`;
        } 
    }
    else danger(tbody);
}

//Création et affichage d'un tableau de catégories
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

//Vide le caddy de tous les éléments qui ont 0 articles
function scanCaddy(){
    caddy.forEach((p) => {
        if(p.getQuantity() == 0)    caddy.delete(p.getId());
    });
}
//Affiche le contenu de mon caddy
function displayCaddy() {
    let elem = document.getElementById("cad");
    total = 0;
    scanCaddy();
    if(caddy != null) {
        elem.innerHTML = '';
        
        caddy.forEach((p) => {        
            elem.innerHTML += "<p>" + p.toString() + " " + "Quantité : " + p.getQuantity() + "</p>";
            total += p.price * p.quantity;
        });
        elem.innerHTML += "<strong>" + "prix total de la commande : " + total + "</strong>";
        document.getElementById("commande").style.display= "block";
    }  
}

//A chaque rajout d'un produit on change la quantité d'un produit ou on le crée
function changeCaddy(product) {
    let p = caddy.get(product.id);

    if (p) {
        caddy.get(product.id).setQuantity(product.getQuantity());
    }
    else {
        let newProduct = new Product(product.id, product.name, product.brand, product.price, product.quantity);
        caddy.set(product.id, newProduct);
    }
}

/*-----------GESTION DES EVENEMENTS DE L'APPLICATION------*/

//renvoi le produit à l'indice donné
function selectProduct(index) {
    return listProduct[index];
}
//association évènements sur changement quantité d'un produit -> caddy modifié
function addListenTable(){
    const cells = document.getElementsByClassName("quantity");    
     for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('change', (event) => {  
            let index = Array.from(document.getElementsByClassName("quantity")).findIndex(e => e === event.target);
        
            let product = selectProduct(index);
            product.setQuantity(document.getElementsByClassName("quantity")[index].value);
            changeCaddy(product);
            displayCaddy();
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
//Pour infos : la même chose en jQuery
/*$(document).ready(function(){     
    //Dès qu'on clique sur suivant, on passe au formulaire avant commande
    $("#commande").click(function(){
        $("#btncom").show();
        $("#confirmer").hide();
        $("#infos").show();
    });
});*/

//Affichage de tous les produits d'une catégorie
function productsByIdCat(id){
    getProducts("/categories/" + id + "/products");
}
//gestion liée à l'activation d'une catégorie cliqué
function notify(el) {
    resetElements();
    el.classList.add('active');
    listCat.forEach(c => {
        if(c.name == el.innerHTML)  productsByIdCat(c.getId());
    })
}  
function resetElements() {
    const els = document.getElementsByClassName("active");
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('active')
    }
}

//Affichage de la confirmation de commande
function displayOrder(order){
    let elem = document.getElementById("conf");
    if(order){
        let date = new Date(order.date);
        elem.innerHTML = '';        
        elem.innerHTML += "<p>" + "<strong>" + " ID COMMANDE : " + order.id + "</strong> </p>";
        elem.innerHTML += "<p>" + "<strong>" + " DATE : "        + date.toLocaleString() + "</strong> </p>";
        elem.innerHTML += "<p>" + "<strong>" + " TOTAL : "       + order.total + "</strong> </p>";
        elem.innerHTML += "<p>" + "<strong>" + " CODE CLIENT : " + order.idCust + "</strong> </p>";
        elem.innerHTML += "<br>";
        elem.innerHTML += "RECAP DE LA COMMANDE :";
        caddy.forEach((p) => {        
            elem.innerHTML += "<p>" + p.toString() + " " + "Quantité : " + p.getQuantity() + "</p>";
            total += p.price * p.quantity;
        });
        document.getElementById("confirmer").style.display= "block";
        document.getElementById("btncom").style.display= "none";
    }
    else {
         danger(elem);
         document.getElementById("confirmer").style.display= "block";
    }
}

//En cas de pb avec le back, message d'erreur
//Au passage, autre manière de modifier notre page html
function danger(elem){      //ToDo : améliorer la gestion d'une erreur
    let msg = document.createTextNode('PROBLEM SERVEUR, REESSAYER PLUTARD');
    elem.style.color = 'red';
    elem.append(msg);
}

//passer une commande après saisi des infos sur le formulaire
function order(){
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    let cart = [];
    caddy.forEach(p => {
        let pi = new ProductItem(p.getId(),p.getName(),p.getQuantity());
        cart.push(pi);
    })

    let order = { 
        "name" : name, "address" : address, "phone" : phone, "email" : email, 
        "total" : total, "cart" : cart
    };

    const options = {
        method: 'POST',
        json: true,
        body: JSON.stringify(order),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    postOrder("/order",options);
    return false;
}

//Envoi d'une requete en post permettant la création d'un client + une commande... puis affichage
function postOrder(service,options){
    postData(service,options).then(data =>{
        displayOrder(JSON.parse(data));  
    });
}




// Init des "composants"
function shop() {
    getProducts("/products");
    getCategories("/categories");
    addListenCde();
}

//lancement de notre appli
shop();