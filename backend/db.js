const path = require('path');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(dbDir, 'database.sqlite'),
    logging: false
});

module.exports = sequelize;  