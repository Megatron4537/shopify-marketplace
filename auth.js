const JWT = require('jsonwebtoken')

module.exports = {
    authenticate,
    createToken
}

/**
 * @description Middleware function that does 1-An authorization header is present 2-Decodes token with same secret into req.user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function authenticate(req,res,next){

    if(!req.headers.authorization) return res.status(401).send({error:'missing authorization headers'})

    JWT.verify(req.headers.authorization,process.env.SECRET,
        (err,decoded)=>{

            if(err) return res.status(401).send(err)

            req.user = { username:decoded.username, id: decoded.id}

            next()
    })
}

/**
 * @description Creates a JWT Token valid for 1h upon login, generates a fake id for simplicity
 * @param {*} req 
 * @param {*} res 
 */
function createToken(req,res){

    if(!req.body || !req.body.username || !req.body.password) return res.status(400).send({error:'invalid payload'})

    JWT.sign({ 
        username: req.body.username,
        id: Math.ceil(Math.random()*1000)
    }, 
    process.env.SECRET,
    {expiresIn:'1h'},
    function(err, token) {

        if(err) return res.status(500).send(err)
        
        res.send(token)
      });
}