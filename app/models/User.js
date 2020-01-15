'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: {
        type: String,
        default: '',
        // enables us to search the record faster
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: 'passskdajakdjkadsj'
    },
    email: {
        type: String,
        default: ''
    },
    mobileNumber: {
        type: Number,
        default: 0
    },
    country: {
        type: String,
        default: ''
    },
    countryCode: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now
    }


})


mongoose.model('User', userSchema);