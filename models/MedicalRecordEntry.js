const mongoose = require('mongoose')

const medicalRecordEntrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, { versionKey: false })

module.exports = mongoose.model('MedicalRecordEntry', medicalRecordEntrySchema)
