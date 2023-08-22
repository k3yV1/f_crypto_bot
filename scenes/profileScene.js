const { Scenes } = require('telegraf')
const profileScene = new Scenes.BaseScene('profileTypeScene')
const UserModel = require('../models/pgModels/userModel/userModel')
const WalletModel = require('../models/pgModels/walletModel/walletModel')
profileScene.enter( async(ctx) => {
	const user = await UserModel.findOne({ where: { chat_id: ctx.from.id }})
	const wallets = await WalletModel.findAll({ where: {user_id: user.id }})

	let message = `Профиль пользователя <b>${user.telegram_user_first_name}</b>:\n\n`;

	if (wallets.length === 0) {
		message += 'У пользователя нет кошельков.';
	} else {
		message += 'Кошельки пользователя:\n';
		wallets.forEach((wallet, index) => {
			message += `${index + 1}. ${wallet.wallet}\n`;
		});
	}

	ctx.reply(message, { parse_mode: 'HTML' }).catch(error => console.log(error));
})

profileScene.leave()

module.exports = profileScene