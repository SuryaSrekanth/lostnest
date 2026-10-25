const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter the item title (e.g. Dell 65W USB-C Charger)'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please enter a description of the item'],
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: [true, 'Specify whether the item is Lost or Found'],
    },
    category: {
        type: String,
        enum: [
            'Tech & Hardware',
            'Badges & Access',
            'Audio & Gadgets',
            'Personal & Apparel',
            'Documents & Wallets',
            'Other',
        ],
        required: [true, 'Please Select a Category'],
    },
    // Corporate Workplace Coordinates
    building: {
        type: String,
        required: [true, 'Please enter the building name/number'],
    },
    floor: {
        type: String,
        required: [true, 'Please enter the floor number'],
    },
    roomZone: {
        type: String,
        required: [true, 'Please specify the room or zone (e.g. Cafeteria, Meeting Room 3B)'],
    },
    dateReported: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required'],
    },
    contactPhone: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Active', 'Claim Pending', 'Returned'],
        default: 'Active',
    },
    // Timestamp set when marked as Returned; used by MongoDB TTL to auto-delete
    resolvedAt: {
        type: Date,
        default: null,
    },
    // Verification workflow for claiming expensive items or reporting found
    claimDetails: {
        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        claimNote: {
            type: String,
            default: '', // Identifying Proof or Handover Location Note
        },
        contactPhone: {
            type: String,
            default: '',
        },
        claimDate: {
            type: Date,
            default: null,
        },
    },
    // Link to the user who reported it
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// TTL Index: Automatically purge document from MongoDB 24 hours (86,400s) after resolvedAt is set
itemSchema.index({ resolvedAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Item', itemSchema);
