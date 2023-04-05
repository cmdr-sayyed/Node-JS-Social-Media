const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const path = require('path');

const feedRoutes = require('../Server/routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // path join will create an absolute path for the images folder

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);
app.use((error, req, res, next) =>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
        message:message
    })
})

const port= process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
        .then(result =>{
            app.listen(port);
            console.log(`Server Running on Port: ${port}`)
        })
        .catch((error) =>{
            console.log(error)
        }) 