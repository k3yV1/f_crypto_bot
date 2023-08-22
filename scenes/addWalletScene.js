const { Scenes } = require('telegraf')
const addWalletScene = new Scenes.BaseScene('addWalletTypeScene')
const UserModel = require('../models/pgModels/userModel/userModel')
const WalletModel = require('../models/pgModels/walletModel/walletModel')

addWalletScene.enter(async (ctx) => {
	await ctx.reply(`<b>${ctx.from.first_name}</b>, введите номер кошелька:`, { parse_mode: 'HTML' });
})

addWalletScene.on('text', async (ctx) => {
	const walletText = ctx.message.text;
	const user = await UserModel.findOne({ where: { chat_id: ctx.from.id } });
	const existingWallet = await WalletModel.findOne({ where: {wallet: walletText, user_id: user.id}})

	if(!user) {
		console.log('User not found')
	}

	if(existingWallet) {
		ctx.reply(`Номер кошелька <b>${walletText}</b> - уже существует, напишите другой`, { parse_mode: 'HTML'})
	} else {
		const newWallet = await WalletModel.create({ wallet: walletText, user_id: user.id })
		await user.update({ wallet_id: newWallet.id})
		ctx.reply(`Кошелёк <b>${walletText}</b> - добавлен`, { parse_mode: 'HTML'})
	}

	ctx.scene.leave()
})

addWalletScene.leave()

module.exports = addWalletScene