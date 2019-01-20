require('dotenv').config()
const EXPECT = require('chai').expect

const CREATETOKEN = require('./auth').createToken
const AUTHENTICATE = require('./auth').authenticate

describe('authentication', function(){

    let JWT

    it('should login and create a JWT token', function(done){
        // passing any username and password, faking an express response object 
        let req = {body:{username:'nick@gmail.com',password:"123"}}
        let res = {
            status: function(){},
            send: input =>{
                JWT = input
                done()}
        }

        CREATETOKEN(req,res)
    })

    it(`should decode the token and return username: 'nick@gmail.com'`, function(done){

        console.log(JWT)
        // passing JWT Token obtained before, faking an express response object 
        let req = {headers:{authorization:JWT}}
        let res = {
            status: function(){
                return {send: err =>{
                    if(err) console.log(err)
                    return done()
                }}
            }
        }

        AUTHENTICATE(req,res,done)

        EXPECT(req.user.username).to.equal('nick@gmail.com')
    })
})