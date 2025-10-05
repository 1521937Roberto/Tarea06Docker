const { DataTypes } = require('sequelize');
const sequelize = require('../bd');

const Usuario = sequelize.define('Usuario', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false
	},
	correo: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	tableName: 'usuarios',
	timestamps: false
});

module.exports = Usuario;
