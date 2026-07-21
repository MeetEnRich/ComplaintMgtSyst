const Complaint = require('../models/Complaint');
const axios     = require('axios');
const { Op }    = require('sequelize');
const { sequelize } = require('../config/db');

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

        // Save to SQLite
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
        const total = await Complaint.count({ where: filter });

        const complaints = await Complaint.findAll({
            where: filter,
            order: [['submittedAt', 'DESC']],
            offset: skip,
            limit: parseInt(limit)
        });

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
        const complaint = await Complaint.findByPk(req.params.id);

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

        const updateData = { status };
        if (status === 'Resolved') updateData.resolvedAt = new Date();

        const [updatedRows] = await Complaint.update(updateData, {
            where: { _id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        const complaint = await Complaint.findByPk(req.params.id);

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
        const total    = await Complaint.count();
        const pending  = await Complaint.count({ where: { status: 'Pending' } });
        const inProgress = await Complaint.count({ where: { status: 'In Progress' } });
        const resolved = await Complaint.count({ where: { status: 'Resolved' } });
        const urgent   = await Complaint.count({ where: { priority: 'Urgent', status: { [Op.ne]: 'Resolved' } } });

        // Aggregate functions mapped from Mongoose
        const byCategoryRaw = await Complaint.findAll({
            attributes: ['category', [sequelize.fn('COUNT', sequelize.col('category')), 'count']],
            group: ['category'],
            order: [[sequelize.col('count'), 'DESC']]
        });
        
        const bySentimentRaw = await Complaint.findAll({
            attributes: ['sentiment', [sequelize.fn('COUNT', sequelize.col('sentiment')), 'count']],
            group: ['sentiment']
        });
        
        const byPriorityRaw = await Complaint.findAll({
            attributes: ['priority', [sequelize.fn('COUNT', sequelize.col('priority')), 'count']],
            group: ['priority']
        });

        // Format to match old Mongoose output: { _id: 'Value', count: Number }
        const byCategory = byCategoryRaw.map(item => ({
            _id: item.category,
            count: item.get('count')
        }));
        const bySentiment = bySentimentRaw.map(item => ({
            _id: item.sentiment,
            count: item.get('count')
        }));
        const byPriority = byPriorityRaw.map(item => ({
            _id: item.priority,
            count: item.get('count')
        }));

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
        const deletedRows = await Complaint.destroy({
            where: { _id: req.params.id }
        });
        
        if (deletedRows === 0) {
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