require('dotenv').config()
const mongoose = require("mongoose")

const dbconnect = async () =>{
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        console.log("se conecto correctamente a la BD")
    
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = dbconnect