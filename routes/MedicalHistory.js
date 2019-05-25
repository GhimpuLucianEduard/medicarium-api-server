const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')
const MedicalRecord = require('../models/MedicalRecord.js')
const MedicalRecordEntry = require('../models/MedicalRecordEntry.js')
const User = require('../models/User.js')
const { check, validationResult } = require('express-validator/check')

router.post("/", checkAuth, async (req, res, next) => {

    const medicalRecord = new MedicalRecord({
        _id: mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        name: req.body.name,
        timestamp: req.body.timestamp,
        category: req.body.category
    })
    
    try {
        const saved = await medicalRecord.save()
        return res.status(200).json(saved)
    } catch(e) {
        console.log(`Error at save: ${e}`)
        return res.status(500).json({
            error: e
        })
    }
})

router.get("/", checkAuth, async (req, res, next) => {

    try {
        const records = await MedicalRecord.find({userId: req.userData.userId}).populate('entries')
        return res.status(200).json(records)
    } catch(e) {
        console.log(`Error at find: ${e}`)
        return res.status(500).json({
            error: e
        })
    }
})

router.delete('/:id', checkAuth, async (req, res, next) => {

    try {
        const result = await MedicalRecord.findOneAndRemove({_id: req.params.id})

        if (!result) {
            return res.status(404).json({
                error: "Invalid id"
            })
        } else {
            return res.status(200).json({msg: "Entry deleted"})
        }
    } catch(e) {
        console.log(`Error at delete: ${e}`)
        return res.status(500).json({
            error: e
        })
    }
})

router.patch('/', checkAuth, async (req, res, next) => {

    try {
        const entries = req.body.entries

        var entriesToAdd = []
        for(const element of entries) {

            const newId = mongoose.Types.ObjectId()
            const newEntry = new MedicalRecordEntry({
                _id: newId,
                imageUrl: element.imageUrl,
                name: element.name,
            })

            const savedEntry = await newEntry.save()
            entriesToAdd.push(newId)
        }

        req.body.entries = entriesToAdd

        const result = await MedicalRecord.findByIdAndUpdate({_id: req.body._id}, req.body, {new: true})

        const result2 = await MedicalRecord
            .findOne({_id: result.id})
            .populate('entries')

        return res.status(200).json(result2)
    } catch(e) {
        console.log(`Error at delete: ${e}`)
        return res.status(500).json({
            error: e
        })
    }
})

module.exports = router