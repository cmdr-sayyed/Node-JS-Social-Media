const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const path = require('path');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth')
const multer = require('multer');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images');
    },
    filename: (req,file,cb) =>{
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) =>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' 
    ) {
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images'))); // path join will create an absolute path for the images folder

// CORS Handling 
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
})

// Routes 
app.use('/feed', feedRoutes);
app.use('/feed', authRoutes);
app.use((error, req, res, next) =>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message:message,
        data:data
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