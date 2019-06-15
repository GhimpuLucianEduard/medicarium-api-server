const express = require('express')
const router = express.Router()
const User = require('../models/User.js')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

router.patch('/', checkAuth, async (req, res, next) => {

    try {
        const user = await User.findByIdAndUpdate({_id: req.body._id}, { $set: req.body }, {new: true})
        return res.status(200).json(user)
    } catch (e) {
        return res.status(500).json(e)
    }

})

module.exports = router