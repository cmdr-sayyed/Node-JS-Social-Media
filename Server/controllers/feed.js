const {validationResult} = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path')

exports.getPosts = (req, res, next) =>{
    const currentPage = req.query.page || 1;
    const perPage = 2; 
    let totalItems;
    Post.find().countDocuments()
        .then((count) =>{
            totalItems = count;
           return Post.find().skip((currentPage - 1) * perPage).limit(perPage)
            }) 
            .then(posts =>{
                res.status(200).json({
               message: 'Fetched Posts Successfully',
               posts: posts,
            totalItems: totalItems})
        })
        .catch((err) =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    
}

exports.createPost = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.')
        error.statusCode = 422;
        throw error;
    }
    if(!req.file){
        const error = new Error('No image Provided')
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title; 
    const content= req. body.content; 
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
        creator: {
            name:"Sayyed"
        },

    })
    post.save().then(result=>{
        res. status(200).json({
            message:'post created successfully',
        },)
    }).catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.getPost = (req, res, next) =>{
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post =>{
            if(!post){
                const error = new Error('Could not find post.')
                error.statusCode = 404;
                throw error; 
            }
            res.status(200).json({
                message:"Post Fetched",
                post: post
            })
        })
        .catch((err) =>{
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        )
}

exports.updatePost = (req, res, next) =>{
    const postId = req.params.postId; 
    const title = req.body.title; 
    const content = req.body.content;
    let imageUrl = req.body.image; 
    if(req.file) {
        imageUrl = req.file.path;
    }
    if(!imageUrl){
        const error = new Error('No file Picked')
        error.statusCode = 422; 
        throw error; 
    }
    Post.findById(postId)
        .then((post) =>{
            if(!post) {
                const error = new Error('Could not find post.')
                error.statusCode = 404;
                throw error;
            }
            if(imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title; 
            post.content = content; 
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then((result)=>{
            res.status(200).json({
                message:"Post Update!",
                post: result
            })
        })
        .catch()
}

exports.deletePost = (req, res, next) =>{
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post =>{
            if(!post) {
                const error = new Error("Could not find Post")
                error.statusCode = 404; 
                throw error;
            }
            // check logged in user 
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result =>{
            res.status(200).json({
                message:"Deleted the post", 
                data: result
            })
        })
        .catch(error=>{
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(err);
        });
}

// remove the image file if the updated image file is new 
const clearImage = (filePath) =>{
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}