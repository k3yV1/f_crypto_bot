const { Scenes, Markup } = require('telegraf');
const fetch = require('node-fetch');

async function getNbuUsdtToUah() {
	try {
		const response= await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5', {
			method: 'GET'
		});

		const data = await response.json();
		const nbuUsdtToUah = data.find(item => item.ccy === 'USD' && item.base_ccy === 'UAH' && item.sale);

		console.log('nbuUsdtToUah: ', nbuUsdtToUah);

		return nbuUsdtToUah.sale;
	} catch (e) {
		console.log(e);
		return null;
	}
}


const sellCryptoETHScene = new Scenes.WizardScene(
	'sellCryptoETHTypeScene', // Уникальный идентификатор сцены
	(ctx) => {
		ctx.reply('Какое количество криптовалюты вы хотите продать?');
		return ctx.wizard.next(); // Переход к следующему обработчику
	},
	(ctx) => {
		const input = ctx.message.text.trim();

		// Проверка с помощью регулярного выражения на число с точкой или запятой
		if (!/^\d+(\.|,)?\d*$/.test(input)) {
			ctx.reply('Введите корректное количество');
			return;
		}

		// Замена запятой на точку, чтобы получить корректное число
		const cryptoAmount = parseFloat(input.replace(',', '.'));

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
				btcPrice = parseFloat(data.find(item => item.symbol === 'ETHUSDT').price).toFixed(2);
				console.log('btc: ', btcPrice)
			} catch (e) {
				console.log(e)
			}

			const cryptoAmount = ctx.wizard.state.cryptoAmount;
			const currency = ctx.wizard.state.currency;

			const price = (cryptoAmount * btcPrice)

			// Здесь можно выполнить дополнительные действия с полученными данными

			await ctx.replyWithMarkdown(`
⚠️ <b>ПРОЧИТАЙТЕ ВНИМАТЕЛЬНО</b>

👤 <b>Пользователь</b>: @${ctx.from.username}
💳 <b>Покупка</b>: ETH
💰 <b>Кол-во криптовалюты на продажу</b>: ${cryptoAmount}
💱 <b>Вы получите</b>: ${price} ${currency.toUpperCase()}`, { parse_mode: 'HTML'})

			await ctx.reply('В течение дня Ваша заявка будет рассмотрена и человек свяжется с Вами по вопросу продажи');
			await ctx.telegram.sendMessage(401941163,`
📩 <b>Заявка</b>			
			
👤 <b>Пользователь</b>: @${ctx.from.username}
💱 <b>Тип криптовалюты</b>: ETH
💰 <b>Кол-во криптовалюты которую хочет купить</b>: ${cryptoAmount}
💳 <b>Стоимость</b>: ${price} ${currency.toUpperCase()}
🗒 <b>Тип заяки</b>: Продажа
`, { parse_mode: 'HTML' })

			return ctx.scene.leave();
		}

		if(ctx.callbackQuery.data === 'uah') {
			ctx.wizard.state.currency = ctx.callbackQuery.data; // Сохраняем выбранную валюту в состоянии
			try {
				const response = await fetch('https://api.binance.com/api/v3/ticker/price', {
					method: 'GET',
					headers: {
						'X-MBX-APIKEY': process.env.BINANCE_API_KEY
					}
				})

				const data = await response.json()
				const btcPrice = parseFloat(data.find(item => item.symbol === 'ETHUSDT').price).toFixed(2);
				const usdtToUah = await getNbuUsdtToUah()

				const cryptoAmount = ctx.wizard.state.cryptoAmount;
				const currency = ctx.wizard.state.currency;
				const price = (cryptoAmount * btcPrice) * usdtToUah


				await ctx.replyWithMarkdown(`
⚠️ <b>ПРОЧИТАЙТЕ ВНИМАТЕЛЬНО</b>

👤 <b>Пользователь</b>: @${ctx.from.username}
💳 <b>Покупка</b>: ETH
💰 <b>Кол-во криптовалюты на продажу</b>: ${cryptoAmount}
💱 <b>Вы получите</b>: ${price} ${currency.toUpperCase()}`, { parse_mode: 'HTML'})

				await ctx.reply('В течение дня Ваша заявка будет рассмотрена и человек свяжется с Вами по вопросу продажи');
				await ctx.telegram.sendMessage(401941163,`
📩 <b>Заявка</b>			
			
👤 <b>Пользователь</b>: @${ctx.from.username}
💱 <b>Тип криптовалюты</b>: ETH
💰 <b>Кол-во криптовалюты которую хочет купить</b>: ${cryptoAmount}
💳 <b>Стоимость</b>: ${price} ${currency.toUpperCase()}
🗒 <b>Тип заяки</b>: Продажа
`, { parse_mode: 'HTML' })

				return ctx.scene.leave();
			} catch (e) {
				console.log(e)
			}
		}
	}
);

module.exports = sellCryptoETHScene;
