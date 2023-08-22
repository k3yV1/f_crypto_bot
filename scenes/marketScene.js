const { Scenes, Markup } = require('telegraf')
const marketScene = new Scenes.BaseScene('marketTypeScene')

marketScene.enter((ctx) => {
	ctx.reply('Здесь Вы можете купить или продать криптовалюту с помощью перевода на карту', Markup.inlineKeyboard([
		Markup.button.callback('📈 Купить', 'buy'),
		Markup.button.callback('📉 Продать', 'sell'),
	])).catch(err => console.log(err))
})

marketScene.action('buy', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.reply('Выберете криптовалюту, которую желаете купить:', Markup.inlineKeyboard([
		[Markup.button.callback('· BTC', 'buy_btc'), Markup.button.callback('· LTC', 'buy_ltc')],
		[Markup.button.callback('· ETH', 'buy_eth'), Markup.button.callback('· XRP', 'buy_xrp')],
		[Markup.button.callback('· USDT', 'buy_usdt')],
	]));
});

marketScene.action('sell', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.reply('Выберете криптовалюту, которую желаете продать:', Markup.inlineKeyboard([
		[Markup.button.callback('· BTC', 'sell_btc'), Markup.button.callback('· LTC', 'sell_ltc')],
		[Markup.button.callback('· ETH', 'sell_eth'), Markup.button.callback('· XRP', 'sell_xrp')],
		[Markup.button.callback('· USDT', 'sell_usdt')],
	]));
});

marketScene.action('buy_btc', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('buyCryptoBTCTypeScene')
})

marketScene.action('buy_ltc', async (ctx) => {
	await ctx.answerCbQuery()
 await ctx.scene.enter('buyCryptoLTCTypeScene')
})

marketScene.action('buy_eth', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('buyCryptoETHTypeScene')
})

marketScene.action('buy_xrp', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('buyCryptoXRPTypeScene')
})

marketScene.action('buy_usdt', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('buyCryptoUSDTTypeScene')
})

// Продажа

marketScene.action('sell_btc', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('sellCryptoBTCTypeScene')
})

marketScene.action('sell_ltc', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('sellCryptoLTCTypeScene')
})

marketScene.action('sell_eth', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('sellCryptoETHTypeScene')
})

marketScene.action('sell_xrp', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('sellCryptoXRPTypeScene')
})

marketScene.action('sell_usdt', async (ctx) => {
	await ctx.answerCbQuery()
	await ctx.scene.enter('sellCryptoUSDTTypeScene')
})

marketScene.leave((ctx) => {
	console.log('Конец сцены - marketScene')
})


module.exports = marketScene