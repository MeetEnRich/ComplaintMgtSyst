const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    complaint_text: {
        type: String,
        required: [true, 'Complaint text is required'],
        trim: true,
        minlength: [10, 'Complaint must be at least 10 characters']
    },
    category: {
        type: String,
        default: null
    },
    sentiment: {
        type: String,
        enum: ['Negative', 'Neutral', null],
        default: null
    },
    sentiment_code: {
        type: Number,
        default: null
    },
    priority: {
        type: String,
        enum: ['Urgent', 'Not Urgent', null],
        default: null
    },
    priority_code: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);