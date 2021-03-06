const GRAPHQL = require('./graphql/graphql')
const LOG = require('debug')('info')

module.exports = {
    createCart,
    getAllProducts,
    getProduct,
    addProduct,
    checkout,
    cart
}

const Cart = require('./cart')

const carts = []

/**
 * @description Util function to retrieve a cart
 * @param {Number} id 
 */
function getCart(id){

    const myCart = carts.find(cart => cart.getId() === id)

    return myCart
}

/**
 * @description Create a cart before adding items to it and checking out
 * @param {*} req 
 * @param {*} res 
 */
function createCart(req,res){

    if(carts.find(cart => cart.getId() === req.user.id)) return res.send({message:'Cart already exists.'})

    const cart = new Cart(req.user.id)

    carts.push(cart)

    res.send({message:'Cart created'})
}

/**
 * @description Get a product by id or get a list of products by type
 * @param {*} req 
 * @param {*} res 
 */
function getProduct(req,res){

    const products = []

    const id = parseInt(req.query.id)
    const type = req.query.type

    if(id){
        GRAPHQL.getProductById(id,(err,product)=>{
            if(err) return res.status(500).send(err)
            return res.send(product)
        })
    }
    else if(type){
        GRAPHQL.getProductsByType(type,(err,product)=>{
            if(err) return res.status(500).send(err)
            return res.send(product)
        })
    }
    else return res.status(400).send({message:'Error invalid query parameters'})
}

/**
 * @description Returns all products
 * @param {*} req 
 * @param {*} res 
 */
function getAllProducts(req,res){

    GRAPHQL.getAll((err,products)=>{
        if(err) return res.status(500).send(err)

        return res.send(products)
    })
}

/**
 * @description Add product to a user's cart
 * @param {*} req 
 * @param {*} res 
 */
function addProduct(req,res){

    const myCart = getCart(req.user.id)
    const id = parseInt(req.query.id)

    if(!myCart) return res.status(400).send({message:'Please create a cart first'})

    if(!id) return res.status(400).send({message:'Invalid payload'})

    GRAPHQL.getProductById(id,(err,product) => {

        if(err) return res.status(500).send(err)

        if(product.quantity === 0) return res.status(404).send({message:`Product id: ${product.id}, "${product.type},${product.variant}" is out of order right now, please try again later or another product`})
        
        myCart.addProduct(product)

        return res.send({message:`Product id: ${product.id}, ${product.type}, ${product.variant} added to cart`})
    })
}

/**
 * @description Returns the total price of the cart, decrements each products quantity by 1 and deletes the cart
 * @param {*} req 
 * @param {*} res 
 */
function checkout(req,res){

    const myCart = getCart(req.user.id)

    if(!myCart) return res.status(400).send({message:'Please create a cart first'})

    if(!myCart.products.length) return res.status(400).send({message:'Empty cart, cannot checkout'})

    const total = myCart.checkout()
    const indexToRemove = carts.findIndex(cart => cart.id == myCart.id)

    carts.splice(indexToRemove,1)

    return res.send({message:`Checkout completed, total is ${total}`})
}


/**
 * @description Returns a user's cart
 * @param {*} req 
 * @param {*} res 
 */
function cart(req,res){

    const myCart = getCart(req.user.id)

    if(!myCart) return res.status(404).send({message:'Please create a cart first'})

    return res.send(myCart)
}