const router = require('express').Router(); 
const { body } = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth')

router.put('/signup',[
    body('email')
        .isEmail()
            .withMessage("Please Enter a valid email")
            .custom((value, {req})=>{
                return User.findOne({email: value}).then(userDoc => { 
                    if(userDoc){
                        return Promise.reject('E-mail address already exists.')
                    }
                })
            })
            .normalizeEmail(), 
    body('password').trim().isLength({min:7}), 
    body('name').trim().not().isEmpty()
], authController.signup)

module.exports = router; 