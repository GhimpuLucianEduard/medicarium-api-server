const express = require('express')
const router = express.Router()
const User = require('../models/User.js')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

router.patch('/', checkAuth, async (req, res, next) => {

    try {
        const user = User.update({_id: req.body._id}, { $set: req.body })
        return res.status(200).json(user)
    } catch (e) {
        return res.status(500).json(e)
    }

})

module.exports = router