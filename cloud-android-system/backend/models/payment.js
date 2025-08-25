const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.FLOAT },
    status: { type: DataTypes.STRING }
});

module.exports = Payment;
