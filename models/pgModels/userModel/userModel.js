const sequelize = require('../../../db')
const { DataTypes } = require('sequelize')
const WalletModel = require('../walletModel/walletModel')

const UserModel = sequelize.define('User', {
	id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, allowNull: false },
	chat_id: { type: DataTypes.INTEGER, unique: true },
	wallet_id: { type: DataTypes.INTEGER, unique: true },
	card_id: { type: DataTypes.INTEGER, unique: true},
	telegram_user_name: { type: DataTypes.STRING, unique: true, allowNull: false },
	telegram_user_first_name: { type: DataTypes.STRING, unique: true, allowNull: false },
	telegram_user_phone: { type: DataTypes.STRING, unique: true },
},{
	freezeTableName: true,
	tableName: "users",
	timestamps: true
})

UserModel.hasMany(WalletModel, { foreignKey: 'user_id' });

module.exports = UserModel;