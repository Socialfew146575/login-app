// const express =require('express')
require("dotenv").config()
import express from "express"
import cors from 'cors'
import morgan from 'morgan'
import connect from "./database/connect.js"

import router from "./router/route.js"

const app=express()

const corsOptions = {
  origin: "http://localhost:3000",
};


app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('tiny'))
app.disable('x-powered-by')


const port = 8080;


app.get('/',(req,res)=>{

res.status(201).json("Home GET Request")

});


// api routes

app.use('/api',router);



connect().then(()=>{

try {
    
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
} catch (error) {
    
    console.log("Cannot connect to the Server")
}



}).catch(error=>{
    console.log("Invalid Database Connection ...")
})

