const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('usuariobd', 'root', 'senati', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;