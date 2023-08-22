const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
	'f_crypto_bot_database',
	'postgres',
	'',
	{
		host: 'localhost',
		port: '5432',
		dialect: 'postgres'
	}
)