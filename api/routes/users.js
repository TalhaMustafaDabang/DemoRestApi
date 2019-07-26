const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    let trace = " trace: signup ";
    User.find({
            email: req.body.email
        })
        .exec()
        .then((user) => {
            trace += " .then((user) => { ";
            if (user.length >= 1) {
                trace += " if (user.length >= 1) { ";
                return res.status(409).json({
                    message: 'User Already Exits',
                });
            } else {
                trace += " else { ";
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        trace += " bcrypt hash error ";
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        trace += " creating user condition ";
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        });
                        user.save().then((result) => {
                            trace += " user.save().then((result) => { ";
                            return res.status(201).json({
                                'message': 'user created'
                            })
                        })
                        // });
                    }
                })
            }
        })
        .catch(e => {
            console.log(e, trace);
            res.status(500).json({
                'error': e
            })
        });
    // res.send();
});


router.delete('/:userId', (req, res, next) => {
    User.remove({
            _id: req.params.id
        }).exec()
        .then((result) => {
            res.status(200).json({
                'message': 'User Deleted!'
            })
        })
        .catch(e => {
            res.status(500).message({
                'error': e
            })
        });
})

router.post('/login', (req, res, next) => {
    let trace = " trace: login ";
    User.find({
            email: req.body.email
        })
        .exec()
        .then((user) => {
            trace += " .then((user) => { ";
            if (user.length < 1) {
                trace += " if (user.length < 1) { ";
                return res.status(404).json({
                    'message': 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                trace += " bcrypt compare ";
                console.log(result);
                if (err) {
                    trace += " if (err) { ";
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result) {
                    trace += " if (result) { ";
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "24h"
                        }
                    );
                    trace += " before => return res.status(200).json({ ";
                    return res.status(200).json({
                        message: 'Auth Success',
                        token: token
                    })
                }
                trace += " before => return res.status(400).json({";
                console.log(trace);
                return res.status(400).json({
                    message: ' Auth Failed'
                })
            })
        })
        .catch(e => {
            console.log(e, trace);
            res.status(500).json({
                error: err
            });
        })
});




module.exports = router;