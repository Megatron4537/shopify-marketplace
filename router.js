const EXPRESS = require('express')
const ROUTER = EXPRESS.Router()

const AUTH = require('./auth')
const ECOM = require('./ecom')


ROUTER.post('/login', AUTH.createToken)

ROUTER.get("/createCart",AUTH.authenticate, ECOM.createCart)

ROUTER.get('/all', AUTH.authenticate, ECOM.getAllProducts)

ROUTER.get('/', AUTH.authenticate, ECOM.getProduct)

ROUTER.get('/add', AUTH.authenticate, ECOM.addProduct)

ROUTER.get('/cart', AUTH.authenticate, ECOM.cart)

ROUTER.get('/checkout', AUTH.authenticate, ECOM.checkout)

module.exports = ROUTER