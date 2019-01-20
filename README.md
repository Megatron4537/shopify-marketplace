# shopify-marketplace
This work is intended for the Shopify 2019 Backend Challenge

## Description
This is the barebones of an online marketplace powered by a REST API that performs basic CRUD operations.
Users can also purchase items. In order to do so they must login, create a cart, add products to it and checkout their cart.

## Build
Make sure you have [Node.js](https://nodejs.org) and [NPM](https://npmjs.com)

Then
```
npm install && npm start
```

### Steps
* First you must login at  POST localhost:8080/login by sending a request with the JSON {username:"any username will do", password: "any password will do"}
* This will return a JWT Token which will be valid for 1hour and that you must add with header 'authorization' to the following requests
* Second, you must create a cart at GET localhost:8080/createCart
* Third, you may get a list of all items at GET localhost:8080/all, one item by id at GET localhost:8080/?id=11, one or many items by type at GET localhost:8080/?type=t-shirt
* You can add items to your cart at GET localhost:8080/add?id=11
* And get your current cart at GET localhost:8080/cart
* Finally, you can checkout at GET localhost:8080/checkout which will return the total price of your cart, decrement item quantities and delete your cart
* To reiterate you must go back to step 2 to create a cart