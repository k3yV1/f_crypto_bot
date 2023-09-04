require('dotenv').config()

const { Telegraf, session, Scenes, Markup } = require('telegraf')
const walletScene = require('./scenes/walletScene')
const profileScene = require('./scenes/profileScene')
const exchangeRateScene = require('./scenes/exchangeRateScene')
const marketScene = require('./scenes/marketScene')
const addWalletScene = require('./scenes/addWalletScene')
const buyBTCCryptoScene = require('./scenes/buyCryptoScenes/buyBTCScene')
const sellBTCCryptoScene = require('./scenes/sellCryptoScenes/sellBTCScene')
const buyLTCCryptoScene = require('./scenes/buyCryptoScenes/buyLTCScene')
const sellLTCCryptoScene = require('./scenes/sellCryptoScenes/sellLTCScene')
const buyETHCryptoScene = require('./scenes/buyCryptoScenes/buyETHScene')
const sellETHCryptoScene = require('./scenes/sellCryptoScenes/sellETHScene')
const buyXRPCryptoScene = require('./scenes/buyCryptoScenes/buyXRPScene')
const sellXRPCryptoScene = require('./scenes/sellCryptoScenes/sellXRPScene')
const buyUSDTCryptoScene = require('./scenes/buyCryptoScenes/buyUSDTScene')
const sellUSDTCryptoScene = require('./scenes/sellCryptoScenes/sellUSDTScene')
const stage = new Scenes.Stage([
	walletScene,
	marketScene,
	profileScene,
	exchangeRateScene,
	addWalletScene,
	buyBTCCryptoScene,
	buyLTCCryptoScene,
	buyETHCryptoScene,
	buyXRPCryptoScene,
	buyUSDTCryptoScene,
	sellBTCCryptoScene,
	sellLTCCryptoScene,
	sellETHCryptoScene,
	sellXRPCryptoScene,
	sellUSDTCryptoScene
])

const sequelize = require('./db')
const UserModel = require('./models/pgModels/userModel/userModel')

const bot = new Telegraf(process.env.TELEGRAM_API)
bot.use(session())
bot.use(stage.middleware())

try {
	sequelize.authenticate()
		.then(() => {
			console.log('Connection to the database has been established successfully.');
		})
	sequelize.sync().then(() => console.log('top'))
} catch (e) {
	console.error('Unable to connect to the database:', e);
}

bot.command("start", async (ctx) => {
	console.log('chat_id: ', ctx.from.id)
	const [user, created ] = await UserModel.findOrCreate({
		where: { chat_id: ctx.from.id },
		defaults: {
			telegram_user_name: ctx.from.username,
			telegram_user_first_name: ctx.from.first_name
		}
	})

	if (created) {
		await ctx.reply('Добро пожаловать в Crypto Buy Bot').catch(error => console.log(error))
		setTimeout(() => {
			ctx.reply(`Как я могу помочь, ${ctx.from.first_name} ?`, Markup.keyboard([['👛 Кошелёк', '💠 Маркет'], ['📊 Курс валют', '🚹 Профиль'], ['➕ Добавить кошелёк']]).resize()).catch(error => console.log(error))
		}, 1000)
	} else {
		await ctx.reply(`С возвращением, ${user.telegram_user_first_name}!`, Markup.keyboard([['👛 Кошелёк', '💠 Маркет'], ['📊 Курс валют', '🚹 Профиль'], ['➕ Добавить кошелёк']]).resize()).catch(error => console.log(error));
	}
})

bot.hears('👛 Кошелёк', (ctx) => {
	ctx.scene.enter('walletTypeScene').catch(err => console.log(err))
})

bot.hears('💠 Маркет', (ctx) => {
	ctx.scene.enter('marketTypeScene').catch(err => console.log(err))
	ctx.scene.leave().catch(err => console.log(err))
})

bot.hears('📊 Курс валют', (ctx) => {
	ctx.scene.enter('exchangeRateTypeScene').catch(err => console.log(err))
	ctx.scene.leave().catch(err => console.log(err))
})

bot.hears('🚹 Профиль', (ctx) => {
	ctx.scene.enter('profileTypeScene').catch(err => console.log(err))
	ctx.scene.leave().catch(err => console.log(err))
})

bot.hears('➕ Добавить кошелёк', (ctx) => {
	ctx.scene.enter('addWalletTypeScene').catch(err => console.log(err))
	ctx.scene.leave().catch(err => console.log(err))
})

bot.launch().catch(err => console.error(err));