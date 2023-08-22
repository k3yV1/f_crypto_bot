const { Scenes } = require('telegraf')
const walletScene = new Scenes.BaseScene('walletTypeScene')
const UserModel = require('../models/pgModels/userModel/userModel')
const WalletModel = require('../models/pgModels/walletModel/walletModel')

walletScene.enter(async (ctx) => {
	const user = await UserModel.findOne({
		where: { chat_id: ctx.from.id },
		include: {
			model: WalletModel,
			attributes: ['wallet'],
		},
	});

	if (!user) {
		ctx.reply('Пользователь не найден');
		return;
	}

	const userWallets = await WalletModel.findAll({ where: { user_id: user.id }})
	if (userWallets.length === 0) {
		return ctx.reply('У вас пока нет кошельков');
	}

	const walletList = userWallets.map(wallet => wallet.wallet).join('\n · ')
	ctx.reply(`
👛 Кошельки: 

	· <b>${walletList}</b>`, { parse_mode: 'HTML'});
})

walletScene.leave()

module.exports = walletScene