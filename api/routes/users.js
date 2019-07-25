const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
               const token = jwt.sign({
                   email: user[0].email,
                   userId: user[0]._id 
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "24h"
                }
                );
                return res.status(409).json({
                    message: 'User Already Exits',
                    token : token
                });
            } else {
                bcrypt.hash(req.body.email, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        });
                        user.save().then((result) => {
                            return res.status(201).json({
                                'message': 'user created'
                            })
                        }).catch(e => {
                            console.log(e);
                            res.status(500).json({
                                'error': e
                            })
                        });
                    }
                })
            }
        })
    res.send();
});


router.delete('/:userId',(req,res,next)=>{
    User.remove({_id: req.params.id}).exec()
    .then((result)=>{res.status(200).json({'message':'User Deleted!'})})
    .catch(e=>{res.status(500).message({'error':e})});
})

router.post('/login',(req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then((user)=>{
        if(user.length<1){
            return res.status(404).json({'message':'Auth Failed'});
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
         if(err){
             return res.status(401).json({
                 message: 'Auth Failed'
             })
         }
         if (result){
             
            return res.status(200).json({
                message: 'Auth Success',
            })
         }
         res.status(400).json({message:' Auth Failed'})   
        })
    })
    .catch(e=>{

    })
})




module.exports = router;