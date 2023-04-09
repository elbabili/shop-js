
//Represente un article minifié servant à une commande, utile côté back pour associer une commande avec les articles concernés
class ArticleItem {
    constructor(id,name,quantity){
        this.id = id;   this.name = name; this.quantity = quantity;
    }
}

//Represente un article
class Article {
    constructor(id, name, brand, price, quantity, categorie) {
        this.id = id;   this.name = name;   this.brand = brand;   this.price = price;   this.quantity = quantity ; this.categorie = categorie;
    }

    getId() { return this.id; }
    getName() { return this.name; }
    getBrand() { return this.brand; }
    getPrice() { return this.price; }
    getQuantity() { return this.quantity; }
    setQuantity(quantity) { this.quantity = quantity; }
    getCategorie() { return this.categorie; }

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

class Order {
    constructor(id, date, amount, customer, articleItems) {
        this.id = id; this.date = date; this.amount = amount; this.customer=customer, this.articleItems = articleItems;
    }

    getId() { return this.id; }
    getDate() { return this.date; }
    getAmount() { return this.amount; }
    getCustomer() { return this.customer; }
    getArticleItems() { return this.articleItems; }
}

class Customer {
    constructor(name, address, phone, email) {
        this.name = name; this.address = address; this.phone = phone; this.email=email;
    }

    getName() { return this.name; }
    getAddress() { return this.address; }
    getPhone() { return this.phone; }
    getEmail() { return this.email; }
}