const express  = require('express');
const router   = express.Router();
const {
    submitComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    getDashboardStats,
    deleteComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/',   submitComplaint);

// Protected admin routes
router.get('/',             protect, getAllComplaints);
router.get('/stats',        protect, getDashboardStats);
router.patch('/:id/status', protect, updateComplaintStatus);
router.delete('/:id',       protect, deleteComplaint);

// Public — must be last to avoid swallowing /stats and /
router.get('/:id', getComplaintById);

module.exports = router;