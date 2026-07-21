const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataDir, 'database.sqlite'),
  logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('SQLite Database Connected & Synced.');
    } catch (error) {
        console.error(`SQLite Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };