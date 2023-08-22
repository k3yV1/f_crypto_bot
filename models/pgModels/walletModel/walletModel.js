const sequelize = require('../../../db')
const { DataTypes } = require('sequelize')

const WalletModel = sequelize.define('Wallet', {
	id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
	user_id: { type: DataTypes.INTEGER, allowNull: false },
	wallet: { type: DataTypes.STRING, unique: true}
},{
	freezeTableName: true,
	tableName: "wallets",
	timestamps: true
})

module.exports = WalletModel