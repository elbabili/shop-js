
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