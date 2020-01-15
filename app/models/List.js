'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listSchema = new Schema({
    listId: {
        type: String,
        default: '',
    },
    listName: {
        type: String,
        default: ''
    },
    private: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    undoCounts: {
        type: Number
    },
    listItems: [{
        itemId: {
            type: String
        },
        parentId: {
            type: String
        },
        itemName: {
            type: String
        },
        status: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdOn: {
            type: Date
        }
    }]


})

listSchema.index({ listId: 1, undoCounts: 1 }, { unique: true });

mongoose.model('List', listSchema);