const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your corporate email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    department: {
        type: String,
        default: 'Engineering',
    },
    officeLocation: {
        type: String,
        default: 'HQ Building 1',
    },
    phone: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['Employee', 'FacilitiesAdmin'],
        default: 'Employee',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);