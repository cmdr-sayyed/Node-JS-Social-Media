const {validationResult} = require('express-validator');
const Post = require('../models/post')

exports.getPost = (req, res, next) =>{
    res.status(200).json({
        posts: [
            {_id:'1',title: 'first post', content:"This is the first post.", image:'images/Image1.jpg',creator:{
                name:"Sayyed"
            }, date: new Date()}
        ]
    })
}

exports.createPost = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            message: "Validation Failed, entered data is incorrect",
            errors: errors.array()  
        })
    }
    const title = req.body.title; 
    const content= req. body.content; 
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: 'images/building.jpg',
        creator: {
            name:"Sayyed"
        },

    })
    post.save().then(result=>{
        res. status(200).json({
            message:'post created successfully',
            
        },)
        console.log(result);
    }).catch(err =>{
        console.log(err);
        res. status(500).json({
            message:'Some error occured'+ err,
            
        },)
    })
    // create post in db 
   
}