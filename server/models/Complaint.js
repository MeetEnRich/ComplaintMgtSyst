const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Complaint = sequelize.define('Complaint', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    complaint_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [10, 5000],
                msg: "Complaint must be between 10 and 5000 characters"
            }
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sentiment: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Negative', 'Neutral', null]]
        }
    },
    sentiment_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [['Urgent', 'Not Urgent', null]]
        }
    },
    priority_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'In Progress', 'Resolved']]
        }
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Complaint;