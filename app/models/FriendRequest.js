'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FriendRequest = new Schema({
    friendId: {
        type: String,
        default: '',
        // enables us to search the record faster
        index: true,
        unique: true
    },
    senderId: {
        type: String,
        default: ''
    },
    senderName: {
        type: String,
        default: ''
    },
    receiverId: {
        type: String,
        default: ''
    },
    receiverName: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'requested'
    },
    createdOn: {
        type: Date,
        default: Date.now
    }


})


mongoose.model('FriendRequest', FriendRequest);