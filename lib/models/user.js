const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const UserSchema = mongoose.Schema({
    id:{
        type: Schema.Types.ObjectId,
    },
    username: {
        // Must be unique; build a unique index
        type: String,
        maxlength: 20,
        minlength: 4,
        match: /^[a-zA-Z\d]+$/,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    email: {
    // Must be unique; build a unique index
        type: String,
        match: /^\w+@\w+(\.\w+)+$/,
        unique: true,
        sparse: true
    },
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

//model 
const User = mongoose.model('User', UserSchema);

module.exports = {User}; 