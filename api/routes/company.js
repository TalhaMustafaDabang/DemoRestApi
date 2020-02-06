const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../middlewares/checkauth');

router.post('/signup', (req, res, next) => {
    let trace = " trace: signup ";
    Company.find({
            email: req.body.email
        })
        .exec()
        .then((company) => {
            trace += " .then((company) => { ";
            if (company.length >= 1) {
                trace += " if (company.length >= 1) { ";
                return res.status(409).json({
                    message: 'company Already Exits',
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
                        trace += " creating company condition ";
                        const company = new Company({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            createdAt: req.body.createdAt || Date.now(),
                            validTill : null,
                            customerRole: req.body.customerRole,
                            customerName: req.body.customerName,
                            companyName: req.body.companyName,
                        });
                        company.save().then((result) => {
                            trace += " company.save().then((result) => { ";
                            return res.status(201).json({
                                'message': 'user created',
                                'customer': result
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
// authMiddleWare,
router.get('/getAll',(req,res,next)=>{
        let trace = " trace: contact get ";
        Company.find()
            .exec()
            .then((docs) => {
                console.log(docs)
                trace =+ " .then((docs) => { ";
                const response = {
                    count: docs.length,
                    companies: docs.map(doc => {
                        return {
                        id: doc._id,
                        email:doc.email,
                        companyName: doc.companyName,
                        customerName: doc.customerName,
                        customerRole: doc.customerRole
                        };
                    }),
                }
                res.status(200).json(response);
            })
            .catch(e => {
                trace += " .catch(e => { ";
                console.log(e, trace);
                res.status(500).json({
                    error: e
                });
            })
    });
    

router.delete('/:userId',[],(req, res, next) => {
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