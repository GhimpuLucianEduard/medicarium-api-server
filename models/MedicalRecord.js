const mongoose = require('mongoose')
const MedicalRecordEntry = require('../models/MedicalRecordEntry')

const medicalRecordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        default: new Date().getTime()
    },
    category: {
        type: String,
        enum: ["PULMONOLOGY", "DERMATOLOGY", "RADIOLOGY", "PSYCHOLOGY", "IMMUNOLOGY", "DENTISTRY", "OPHTHALMOLOGY", "OTOLOGY", "HEMATOLOGY", "CARDIOLOGY", "OTHER"],
        default: "OTHER"
    }, 
    entries: [{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'MedicalRecordEntry'
    }],
}, { versionKey: false })

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema)
