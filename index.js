require('dotenv').config()
const MORGAN = require("morgan")
const EXPRESS = require("express")
const CORS = require("cors")
const LOG = require('debug')('INFO')

const ROUTER = require("./router")

const APP = EXPRESS()

/**
 * Middlware functions
 */
APP.use(MORGAN("dev"))
APP.use(CORS())

APP.use(EXPRESS.json())

/**
 * Use routes defined router.js
 */
APP.use('/',ROUTER)

/**
 * Return 404 on any other routes
 */
APP.use('*', (req,res) => {
    res.status(404).send('page not found')
})

APP.listen(process.env.PORT || 8080,()=>{
    LOG(`server started on PORT ${process.env.PORT}`)
})