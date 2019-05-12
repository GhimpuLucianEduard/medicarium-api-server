const assert = require('assert')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../index')
const mongoose = require('mongoose')
const MedicalRecord = require('../models/MedicalRecord.js')

describe('Unit testing for /medicalHistory GET', function() {
    it('should return 404, invalid route', function() {
        return request(app)
            .get('/medicalHistory2')
            .then(function(response) {
                assert.equal(response.status, 404)
            })
    })
})

describe('Unit testing for /medicalHistory GET', function() {
    it('should return 200', function() {
        return request(app)
            .get('/medicalHistory')
            .then(function(response) {
                assert.equal(response.status, 200)
            })
    })
})

describe('Unit testing for /medicalHistory POST', function() {
    it('should return 200', function() {
        return request(app)
            .post('/medicalHistory')
            .send({name: "ceva", category: "OPHTHALMOLOGY"})
            .set('Accept', 'application/json')
            .expect("Content-type",/json/)
            .then(function(response) {
                assert.equal(response.status, 200)
            })
    })
})

describe('Unit testing for /medicalHistory POST', function() {
    it('should return 500, invalid data', function() {
        return request(app)
            .post('/medicalHistory')
            .send({category: "OPHTHALMOLOGY"})
            .set('Accept', 'application/json')
            .expect("Content-type",/json/)
            .then(function(response) {
                assert.equal(response.status, 500)
            })
    })
})

describe('Unit testing for /medicalHistory DELETE', function() {
    it('should return 404, invalid id', function() {
        return request(app)
            .delete('/medicalHistory/5cbaefdf50a31f0024f38e57')
            .set('Accept', 'application/json')
            .expect("Content-type",/json/)
            .then(function(response) {
                assert.equal(response.status, 404)
            })
    })
})

describe('Unit testing for /medicalHistory DELETE', function() {
    it('should return 200', async function() {
        
        const rand = Math.floor(Math.random());
        const randomDoc = await MedicalRecord.findOne().skip(rand);

        const response = await request(app)
            .delete('/medicalHistory/'+randomDoc._id)
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .then(function(response) {
                assert.equal(response.status, 200)
            })
    })
})

describe('Unit testing for /medicalHistory PATCH', function() {
    it('should return 500, invalid data', function() {
        return request(app)
            .patch('/medicalHistory')
            .send({category: "OPHTHALMOLOGY"})
            .set('Accept', 'application/json')
            .expect("Content-type",/json/)
            .then(function(response) {
                assert.equal(response.status, 500)
            })
    })
})