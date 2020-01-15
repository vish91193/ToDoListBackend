'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listCurrentCountSchema = new Schema({
    listId: {
        type: String,
        default: '',
        // enables us to search the record faster
        index: true,
        unique: true
    },
    undoCurrentCount: {
        type: Number
    },
    listName: {
        type: String,
        default: ''
    },
    createdBy: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    private: {
        type: Boolean,
        default: true
    }


})


mongoose.model('ListCurrentCount', listCurrentCountSchema);