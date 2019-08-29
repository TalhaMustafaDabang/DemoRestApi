const mongoose = require('mongoose');

const incidentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    member: String,
    brands: String,
    incidentParentId: String,
    type: String,
    incidentClass: String,
    incidentSubject: String,
    preAuthorised: Boolean,
    authorizationEvidence: String,
    severity: String,
    status: String,
    snapshot: String,
    creationDate: Date,
    lastUpdateDate: Date,
    fraudCasting: Boolean,
    baiting: Boolean,
    suggestedCOA: String,
    actualCOA: String,
    feedbackProvidedByMember: Boolean,
    memberRequestedCourseOfAction: Boolean,
    memberFeedbackProvidedBy: String,
    memberFeedbackProvidedAt: Date,
    memberFeedbackRemarks: String,
    reappearanceCount: Number,
    remarks: String,
    description: String,
})

module.exports = mongoose.model('Incident',incidentSchema);