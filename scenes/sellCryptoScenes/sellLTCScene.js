const { Scenes, Markup } = require('telegraf');
const fetch = require('node-fetch')

const sellCryptoLTCScene = new Scenes.WizardScene(
	'sellCryptoLTCTypeScene', // Уникальный идентификатор сцены
	(ctx) => {
		ctx.reply('Какое количество криптовалюты вы хотите продать?');
		return ctx.wizard.next(); // Переход к следующему обработчику
	},
	(ctx) => {
		const cryptoAmount = parseFloat(ctx.message.text);
		if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
			ctx.reply('Введите корректное количество');
			return;
		}

		ctx.wizard.state.cryptoAmount = cryptoAmount; // Сохраняем количество в состоянии

		ctx.reply('Выберите валюту в которой желаете получить:', Markup.inlineKeyboard([
			Markup.button.callback('USD', 'usd'),
			Markup.button.callback('UAH', 'uah'),
		]));

		return ctx.wizard.next(); // Переход к следующему обработчику
	},
	async (ctx) => {
		if (ctx.callbackQuery.data === 'usd') {
			ctx.wizard.state.currency = ctx.callbackQuery.data; // Сохраняем выбранную валюту в состоянии
			let btcPrice = 0
			try {
				const response = await fetch('https://api.binance.com/api/v3/ticker/price', {
					method: 'GET',
					headers: {
						'X-MBX-APIKEY': process.env.BINANCE_API_KEY
					}
				})

				const data = await response.json()
				btcPrice = parseFloat(data.find(item => item.symbol === 'LTCUSDT').price).toFixed(2);
				console.log('btc: ', btcPrice)
			} catch (e) {
				console.log(e)
			}

			const cryptoAmount = ctx.wizard.state.cryptoAmount;
			const currency = ctx.wizard.state.currency;

			const price = (cryptoAmount * btcPrice)

			console.log('price: ', price)

			// Здесь можно выполнить дополнительные действия с полученными данными

			await ctx.replyWithMarkdown(`
⚠️ <b>ПРОЧИТАЙТЕ ВНИМАТЕЛЬНО</b>

👤 <b>Пользователь</b>: @${ctx.from.username}
💳 <b>Покупка</b>: LTC
💰 <b>Кол-во криптовалюты на продажу</b>: ${cryptoAmount}
💱 <b>Вы получите</b>: ${price} ${currency.toUpperCase()}`, { parse_mode: 'HTML'})

			await ctx.reply('В течение дня Ваша заявка будет рассмотрена и человек свяжется с Вами по вопросу продажи');
			await ctx.telegram.sendMessage(378520189,`
📩 <b>Заявка</b>			
			
👤 <b>Пользователь</b>: @${ctx.from.username}
💱 <b>Тип криптовалюты</b>: LTC
💰 <b>Кол-во криптовалюты которую хочет купить</b>: ${cryptoAmount}
💳 <b>Стоимость</b>: ${price} ${currency.toUpperCase()}
🗒 <b>Тип заяки</b>: Продажа
`)

			return ctx.scene.leave();
		}

		if(ctx.callbackQuery.data === 'uah') {
			ctx.wizard.state.currency = ctx.callbackQuery.data; // Сохраняем выбранную валюту в состоянии

			let btcPrice = 0
			try {
				const response = await fetch('https://api.binance.com/api/v3/ticker/price', {
					method: 'GET',
					headers: {
						'X-MBX-APIKEY': process.env.BINANCE_API_KEY
					}
				})

				const data = await response.json()
				btcPrice = parseFloat(data.find(item => item.symbol === 'LTCUAH').price).toFixed(2);
				console.log('btc: ', btcPrice)
			} catch (e) {
				console.log(e)
			}

			const cryptoAmount = ctx.wizard.state.cryptoAmount;
			const currency = ctx.wizard.state.currency;

			const price = (cryptoAmount * btcPrice)

			console.log('price: ', price)

			// Здесь можно выполнить дополнительные действия с полученными данными

			await ctx.replyWithMarkdown(`
⚠️ <b>ПРОЧИТАЙТЕ ВНИМАТЕЛЬНО</b>

👤 <b>Пользователь</b>: @${ctx.from.username}
💳 <b>Покупка</b>: LTC
💰 <b>Кол-во криптовалюты на продажу</b>: ${cryptoAmount}
💱 <b>Вы получите</b>: ${price} ${currency.toUpperCase()}`, { parse_mode: 'HTML'})

			await ctx.reply('В течение дня Ваша заявка будет рассмотрена и человек свяжется с Вами по вопросу продажи');
			await ctx.telegram.sendMessage(378520189,`
📩 <b>Заявка</b>			
			
👤 <b>Пользователь</b>: @${ctx.from.username}
💱 <b>Тип криптовалюты</b>: LTC
💰 <b>Кол-во криптовалюты которую хочет купить</b>: ${cryptoAmount}
💳 <b>Стоимость</b>: ${price} ${currency.toUpperCase()}
🗒 <b>Тип заяки</b>: Продажа
`, { parse_mode: 'HTML'})
			return ctx.scene.leave();
		}
	}
);

module.exports = sellCryptoLTCScene;
