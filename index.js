const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth.js')
const userPreferencesRoute = require('./routes/UserPreferences.js')
const medicalHistoryRoutes = require('./routes/MedicalHistory.js')
const mongoose = require('mongoose')

const uri = "mongodb+srv://admin:e9VzoWwdEpaNE5MQ@glucose-b6a49.mongodb.net/test?retryWrites=true"
mongoose.connect(uri)
.then(()=>{
    console.log("Connected to atlas")
}).catch(err => {
    console.log("Failed to connect to atlas")
    console.log(err)
})

//mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
});

app.use('/auth', authRoutes)
app.use('/medicalHistory', medicalHistoryRoutes)
app.use('/userPreferences', userPreferencesRoute)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: error.message
    })
});

module.exports = app
