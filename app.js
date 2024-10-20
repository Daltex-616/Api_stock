require('dotenv').config()
const express = require("express")
const dbconnect = require('./config/db')


const app = express()

const port = process.env.PORT


dbconnect().then(()=>{
    app.listen(port,()=>{
        console.log("api funcionando")
    })
}).catch(err =>{
    console.log(`no se pudo conectar la api por el error = ${err}`)
})

