
const Complaint = require('../models/Complaint');
const axios     = require('axios');

const MAX_LENGTH = 5000;

const sanitize = (text) =>
    text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// ── Submit a new complaint ─────────────────────────────────────────────────
const submitComplaint = async (req, res) => {
    try {
        const raw = req.body.complaint_text;

        if (!raw || typeof raw !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Complaint text is required'
            });
        }

        const complaint_text = sanitize(raw);

        if (complaint_text.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Complaint text must be at least 10 characters'
            });
        }

        if (complaint_text.length > MAX_LENGTH) {
            return res.status(400).json({
                success: false,
                message: `Complaint text must not exceed ${MAX_LENGTH} characters`
            });
        }

        // Call Flask ML API
        const flaskResponse = await axios.post(
            `${process.env.FLASK_API_URL}/predict`,
            { complaint_text },
            { timeout: 10000 }
        );

        const {
            category,
            sentiment,
            sentiment_code,
            priority,
            priority_code
        } = flaskResponse.data;

        // Save to MongoDB
        const complaint = await Complaint.create({
            complaint_text,
            category,
            sentiment,
            sentiment_code,
            priority,
            priority_code
        });

        return res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            data: complaint
        });

    } catch (error) {
        console.error('Submit complaint error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                message: 'ML service is currently unavailable. Please try again later.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
};

// ── Get all complaints (admin) ─────────────────────────────────────────────
const getAllComplaints = async (req, res) => {
    try {
        const { status, priority, category, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status)   filter.status   = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        const skip  = (page - 1) * limit;
        const total = await Complaint.countDocuments(filter);

        const complaints = await Complaint.find(filter)
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: complaints
        });

    } catch (error) {
        console.error('Get complaints error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
};

// ── Get single complaint ───────────────────────────────────────────────────
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: complaint
        });

    } catch (error) {
        console.error('Get complaint error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
};

// ── Update complaint status (admin) ───────────────────────────────────────
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'In Progress', 'Resolved'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const update = { status };
        if (status === 'Resolved') update.resolvedAt = new Date();

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully',
            data: complaint
        });

    } catch (error) {
        console.error('Update status error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
};

// ── Dashboard analytics ───────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        const total    = await Complaint.countDocuments();
        const pending  = await Complaint.countDocuments({ status: 'Pending' });
        const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
        const resolved = await Complaint.countDocuments({ status: 'Resolved' });
        const urgent   = await Complaint.countDocuments({ priority: 'Urgent', status: { $ne: 'Resolved' } });

        const byCategory = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const bySentiment = await Complaint.aggregate([
            { $group: { _id: '$sentiment', count: { $sum: 1 } } }
        ]);

        const byPriority = await Complaint.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                inProgress,
                resolved,
                urgent,
                byCategory,
                bySentiment,
                byPriority
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
};

// ── Delete a complaint (Admin only) ───────────────────────────────────────
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Complaint deleted successfully'
        });
    } catch (error) {
        console.error('Delete complaint error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
};

module.exports = {
    submitComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    getDashboardStats,
    deleteComplaint
};