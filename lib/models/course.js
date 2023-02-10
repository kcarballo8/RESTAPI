// require('../db');

const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const user = require('./user');

const CourseSchema = new Schema({
    subject:{ 
        type: String,
        minlength: 4,
        maxlength: 4,
        required: true,
        uppercase: true

    },
    number: {
        type: Number,
        min: 1000,
        max: 6999,
        required: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: {        
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        index: true,
        default: [],
    },
    // unique: subject + number
},

{
        toJSON: {
            getters: false,
            virtuals: false,
            transform: (doc, obj, options) => {
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        }
    }

});

CourseSchema.index({ subject: 1, number: 1 }, { unique: true });
//model 
const Course = mongoose.model('Course', CourseSchema);

module.exports = {Course};