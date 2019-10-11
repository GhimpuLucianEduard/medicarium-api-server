const express = require('express')
const router = express.Router()
const User = require('../models/User.js')
const TwoFactorsCheck = require('../models/TwoFactorsCheck.js')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check');
const axios = require("axios");

const smsURL = `https://medicarium-2fa.herokuapp.com/2fa`;

router.post('/signup', [
    check('email').isEmail(),
    check('password').isLength({ min: 6})
], async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        console.log(req.body.email)
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(409).json({
                error: "Email already in use."
            })
        } else {

            const hash = await bcrypt.hash(req.body.password, 10);

            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                gender: req.body.gender,
                birthDate: req.body.birthDate,
                bloodType: req.body.bloodType,
                height: req.body.height,
                weight: req.body.weight,
                healthIssues: req.body.healthIssues,
                onGoingTreatments: req.body.onGoingTreatments,
                allergies: req.body.allergies,
                emergencyContactName: req.body.emergencyContactName,
                emergencyContactPhoneNumber: req.body.emergencyContactPhoneNumber,
                status: true,
                isFirstNameVisible: false,
                isLastNameVisible: false,
                isPhoneNumberVisible: false,
                isGenderVisible: false,
                isBirthDateVisible: false,
                isBloodTypeVisible: false,
                isHeightVisible: false,
                isWeightVisible: false,
                isEmergencyContactNameVisible: false,
                isEmergencyContactPhoneNumberVisible: false
            })

            // const token = jwt.sign({
            //     email: user.email,
            //     userId: user._id
            // }, process.env.JWT_KEY, 
            // {
            //     expiresIn: "1000d"
            // }

            try
            {
                await user.save()
                const savedUser = await User.findOne({_id: user._id}).select("-password")
                return res.status(200).json(savedUser)
                const code = Math.floor(1000 + Math.random() * 9000).toString();

//                 const twoFactorsCheck = new TwoFactorsCheck({
//                     _id: new mongoose.Types.ObjectId(),
//                     userId: savedUser._id,
//                     code: code,
//                     timestamp: Date.now(),
//                     resolved: false
//                 })

                //await twoFactorsCheck.save()

//                 try {
//                     const response = await axios.post(smsURL, {
//                         text: `Codul pentru Medicarium valabil 5 minute: `,
//                         code: code,
//                         number: savedUser.phoneNumber
//                     })  
                    
//                     if (response.status == 200) {
//                         return res.status(200).json(savedUser)
//                     } 
//                 } catch(e) {
//                     console.log("1")
//                     return res.status(500).json(e)
//                 }
            
            } catch(e) {
                console.log(e)
                return res.status(500).json(e)
            }
        }
    } catch(e) {
        console.log("3")
        return res.status(500).json(e)
    }

    return res
})

router.post('/check2fa', async (req, res, next) => {

    try {
        const verification = await TwoFactorsCheck.findOne({userId: req.body.userId, code: req.body.code})
        if (verification) {

            if (verification.resolved) {
                return res.status(401).json({error: "Verification failed!"})
            }

            const dateNow = Date.now()
            const sentDate = verification.timestamp
            const difference = dateNow - sentDate;
            const minutesDifference = Math.floor(difference/1000/60);

            if (minutesDifference > 5) {
                return res.status(401).json({error: "Verification failed!"})
            } 

            const user = await User.findOne({_id: verification.userId})
            user.status = true
            const updatedUser = await user.save()

            const token = jwt.sign({
                email: updatedUser.email,
                userId: updatedUser._id
            }, process.env.JWT_KEY, 
            {
                expiresIn: "1000d"
            })
            
            verification.resolved = true
            await verification.save()

            return res.status(200).json({user: updatedUser, token: token})
        } else {
            return res.status(401).json({error: "Verification failed!"})
        }
    } catch(e) {
        return res.status(500).json(e)
    }
})

router.post('/send2fa', async (req, res, next) => {

    if (req.body.userId) {

        if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const user = await User.findOne({ _id: req.body.userId })

        if (user) {

            if (user.status) {
                return res.status(300).json({
                    message: "User already verified!"
                })
            }

            const code = Math.floor(1000 + Math.random() * 9000).toString();

            const twoFactorsCheck = new TwoFactorsCheck({
                _id: new mongoose.Types.ObjectId(),
                userId: user._id,
                code: code,
                timestamp: Date.now(),
                resolved: false
            })

            try {
                const response = await axios.post(smsURL, {
                    text: `Codul pentru Medicarium valabil 5 minute: `,
                    code: code,
                    number: user.phoneNumber
                })  
            

                if (response.status == 200) {
                    console.log("aici")
                    return res.status(200).json({
                        msg: "Sms sent."
                    })
                } 

            } catch(e) {
                return res.status(500).json(e.response.data)
            }
        } else {
            return res.status(404).json({
                error: "User not found"
            })
        }

    } else {
        return res.status(404).json({
            error: "userId not specified"
        })
    }
})

router.post('/login', [
    check('email').isEmail(),
    check('password').isLength({ min: 6})
], async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            var ok = await bcrypt.compare(req.body.password, user.password)
            
            if (ok) {
                if (!user.status) {
                    return res.status(403).json({error: "User not verified, please verify your account first."})
                } 
                
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_KEY, 
                {
                    expiresIn: "1000d"
                })
                console.log("aici")
                return res.status(200).json({
                    user: user,
                    token: token
                })

            } else {
                return res.status(401).json({
                    error: "Auth failed!"
                })
            }
        } else {
            return res.status(404).json({
                error: "User not found"
            })
        }
    } catch(e) {
        return res.status(500).json(e)
    }

})

module.exports = router
