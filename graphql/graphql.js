const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    graphql
} = require('graphql')

// dummy data
const products = require('./products.json')

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
        },
        all: {
            type: new GraphQLList(productType),    
            args: {all:{type:GraphQLString}},
            resolve(parent,args){
                return products
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: rootQuery
})

function getProductsByType(type,callback){
    graphql(schema,`{type(type:\"${type}\"){type id price quantity variant}}`)
    .then(res=>{
        callback(null, res.data.type)
    })
    .catch(callback)
}

function getProductById(id,callback){
    graphql(schema,`{id(id:${id}){type id price quantity variant}}`)
    .then(res=>{
        callback(null, res.data.id)
    })
    .catch(callback)
}

function getAll(callback){
    callback(null,products)
}

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