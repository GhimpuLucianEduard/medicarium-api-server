const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = require('../models/User.js')

module.exports = async (req, res, next) => {

    if (process.env.NODE_ENV === 'test') {
        try {

            const rand = Math.floor(Math.random());
            const randomDoc = await User.findOne().skip(rand);
            req.userData = { email: randomDoc.email,
                userId: randomDoc._id,
                iat: 1555755273,
                exp: 1642155273}
            next();
        } catch (e) {
            return res.status(500).json({
                message: 'Server error'
            });
        }
    } else {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.userData = decoded;
            console.log(decoded)
            next();
        } catch (e) {
            return res.status(401).json({
                message: 'Forbidden access.'
            });
        }
    }
};