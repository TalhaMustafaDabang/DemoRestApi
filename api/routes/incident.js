const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const Incident  = require('../models/incident');



router.post('/',(req,res,next)=>{
    const incident = new Incident({
        _id: new mongoose.Type.ObjectId(),
        member: req.body.member,
        brands: req.body.brands,
        incidentParentId: req.body.incidentParentId,
        type: req.body.type,
        incidentClass: req.body.incidentClass,
        incidentSubject: req.body.incidentSubject,
        preAuthorised: req.body.preAuthorised,
        authorizationEvidence: req.body.authorizationEvidence,
        severity: req.body.severity,
        status: req.body.status,
        snapshot: req.body.snapshot,
        creationDate: req.body.creationDate,
        lastUpdateDate: req.body.lastUpdateDate,
        fraudCasting: req.body.fraudCasting,
        baiting: req.body.baiting,
        suggestedCOA: req.body.suggestedCOA,
        actualCOA: req.body.actualCOA,
        feedbackProvidedByMember: req.body.feedbackProvidedByMember,
        memberRequestedCourseOfAction: req.body.memberRequestedCourseOfAction,
        memberFeedbackProvidedBy: req.body.memberFeedbackProvidedBy,
        memberFeedbackProvidedAt: req.body.memberFeedbackProvidedAt,
        memberFeedbackRemarks: req.body.memberFeedbackRemarks,
        reappearanceCount: req.body.reappearanceCount,
        remarks: req.body.remarks,
        description: req.body.description,        
    });

    incident.save().then(result=>{
        return res(result);
    })
    .catch(e=>{
        return rej(e);
    })
    
})

router.get('/',(req,res,next)=>{
    return res.send({done:"done"});
})



module.exports = router;