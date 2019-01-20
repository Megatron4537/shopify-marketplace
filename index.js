require('dotenv').config()
const MORGAN = require("morgan")
const EXPRESS = require("express")
const CORS = require("cors")
const LOG = require('debug')('INFO')

const ROUTER = require("./router")

const APP = EXPRESS()

APP.use(MORGAN("dev"))
APP.use(CORS())

APP.use(EXPRESS.json())

APP.use('/',ROUTER)

APP.use('*', (req,res) => {
    res.status(404).send('page not found')
})

APP.listen(process.env.PORT || 3000,()=>{
    LOG(`server started on PORT ${process.env.PORT}`)
})