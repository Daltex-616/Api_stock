require('dotenv').config()
const express = require("express")
const dbconnect = require('./config/db')
const productoRoutes = require("./routes/productos.js")


const app = express()

app.use(express.json())
app.use(productoRoutes)
const port = process.env.PORT


dbconnect().then(()=>{
    app.listen(port,()=>{
        console.log("api funcionando")
    })
}).catch(err =>{
    console.log(`no se pudo conectar la api por el error = ${err}`)
})

