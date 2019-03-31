const mongoose = require('mongoose')

const twoFactorsCheckSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    code: {
        type: String,
        required: true,
        minlength: 4
    },
    timestamp: {
        type: Number,
        required: true
    },
    resolved: {
        type: Boolean,
        required: true
    }
}, { versionKey: false })

module.exports = mongoose.model('TwoFactorCheck', twoFactorsCheckSchema)