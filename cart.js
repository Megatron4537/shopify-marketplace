
const GRAPHQL = require('./graphql/graphql')

module.exports = class Cart{

    constructor(id){
        this.id = id
        this.products = []
    }


    getId(){
        return this.id
    }

    addProduct(item){
        this.products.push(item)
    }

    getProduct(itemId){

        const itemFound = null

        this.products.forEach(item => {
            if(item.id == itemId) itemFound = item
        })

        return itemFound
    }

    checkout(){

        let total = 0
        this.products.forEach(item =>{
            GRAPHQL.decrementQuantity(item.id)
            total += item.price
        })

        return total
    }

}