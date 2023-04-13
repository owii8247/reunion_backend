const express = require("express")
const cors = require("cors")
require("dotenv").config()
const bodyParser = require("body-parser")
const connection = require("./config/db")
const AllRoutes = require("./routes/AllRoutes")
const app = express()
app.use(cors())
PORT = process.env.PORT || 8000

// Middlewares
app.use(bodyParser.json()) 


// Get Request 
app.get("/", async(req,res)=>{
    res.send("Welcome to Reunion Backend")
})

// Routes
app.use("/", AllRoutes)

// Listening
app.listen(PORT, async()=>{
    try{
        await connection
        console.log("MongoDB Connected Successfully")
    }
    catch(err){
        console.log(err)
    }
    console.log(`Listening on PORT ${PORT}`)
})