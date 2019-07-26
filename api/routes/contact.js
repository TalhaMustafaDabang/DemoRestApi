const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const mongoose = require('mongoose');
const authMiddleWare = require('../middlewares/checkauth');


router.get('/test',(req,res,next)=>{
    console.log("hitted")
   return res.json({message:'done'});
});

router.get('/', authMiddleWare, (req, res, next) => {
    let trace = " trace: contact get ";
    Contact.find()
        .exec()
        .then((docs) => {
            trace =+ " .then((docs) => { ";
            const response = {
                count: docs.length,
                contacts: docs.map(doc => {
                    return {
                        name: doc.name,
                        email: doc.email,
                        phone: doc.phone,
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

router.post('/', authMiddleWare, (req, res, next) => {
    let trace  = " trace : contact post ";
    const contact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    });
    contact.save()
        .then(result => {
            trace += " .then(result => { ";
            res.status(200).json({
                message: 'Contact Created Successfully!',
                createdContact: {
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    _id: result._id
                }
            })
        })
        .catch(e => {
            trace += " .catch(e => { ";
            console.log(err,trace);
            res.status(500).json({
            error: err
            });
        })
});

router.patch('/:contactId', authMiddleWare, (req, res, next) => {
    let trace = " trace : contact patch ";
    const id = req.params.productId;
    const updateOps = {
        name : req.body.name,
        email  : req.body.email,
        phone : req.body.phone, 
        _id : id
    };
    // for (const ops of req.body){
    //     updateOps[ops.propName] = ops.value
    // }
    Contact.update({_id:id},{$set:updateOps})
    .exec()
    .then(result => {
    trace += " .then(result => { ";
      res.status(200).json({
          message: 'Contact updated',
          updatedContact : result,
      });
    })
    .catch(err => {
    trace += " .catch(err => { ";
      console.log(err, trace);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:contactId', authMiddleWare, (req, res, next) => {
  let trace = " trace : contact delete ";
  const id = req.params.contactId;
  Contact.remove({ _id: id })
    .exec()
    .then(result => {
    trace += " .then(result => { ";
      res.status(200).json({
          message: 'Contact deleted',
      });
    })
    .catch(err => {
        trace += " .catch(err => { ";
        console.log(err, trace);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;