const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    graphql
} = require('graphql')

// dummy data that first populates our db
const products = require('./products.json')

/**
 * Product schema
 */
const productType = new GraphQLObjectType({
    name:'Product',
    fields: () => ({
        id: {type: GraphQLInt},
        variant: {type: GraphQLString},
        price: {type: GraphQLFloat},
        quantity: {type: GraphQLInt},
        type: {type: GraphQLString}
    })
})

// define queries
const rootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        id:{        // returns 1 object
            type: productType,  
            args: {id: {type: GraphQLInt}},
            resolve(parent,args){

                let itemFound = null

                itemFound = products.find(item => item.id === args.id)

                return itemFound
            }
        },
        type:{  // returns 0, 1 or many objects
            type: new GraphQLList(productType),    
            args: {type: {type: GraphQLString}},
            resolve(parent,args){

                let itemsFound = products.filter(item => item.type === args.type)

                return itemsFound
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: rootQuery
})

/**
 * Returns 0 or many products
 * @param {String} type @example t-shirt
 * @param {*} callback 
 */
function getProductsByType(type,callback){
    graphql(schema,`{type(type:\"${type}\"){type id price quantity variant}}`)
    .then(res=>{
        callback(null, res.data.type)
    })
    .catch(callback)
}

/**
 *  Returns 0 or 1 product
 * @param {Number} id @example 11
 * @param {*} callback 
 */
function getProductById(id,callback){
    graphql(schema,`{id(id:${id}){type id price quantity variant}}`)
    .then(res=>{
        callback(null, res.data.id)
    })
    .catch(callback)
}

/** 
 * Returns all products
*/
function getAll(callback){
    callback(null,products)
}

/**
 * Decrements a products quantity by 1 and return the product
 * @param {Number} id @example 11
 */
function decrementQuantity(id){

    let product = products.find(item => item.id === id)

    if(product) product.quantity--

    return product
}

module.exports = {
    schema,
    getProductsByType,
    getProductById,
    getAll,
    decrementQuantity
}