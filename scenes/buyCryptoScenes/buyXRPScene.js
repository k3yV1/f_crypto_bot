const { Scenes, Markup } = require('telegraf');
const fetch = require('node-fetch')

async function getNbuUsdtToUah() {
	try {
		const response= await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5', {
			method: 'GET'
		});

		const data = await response.json();
		const nbuUsdtToUah = data.find(item => item.ccy === 'USD' && item.base_ccy === 'UAH' && item.buy);

		return nbuUsdtToUah.buy;
	} catch (e) {
		console.log(e);
		return null;
	}
}

const buyCryptoXRPScene = new Scenes.WizardScene(
	'buyCryptoXRPTypeScene', // Уникальный идентификатор сцены
	(ctx) => {
		ctx.reply('Какое количество криптовалюты вы хотите купить?');
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

		ctx.reply('Выберите валюту:', Markup.inlineKeyboard([
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
				btcPrice = parseFloat(data.find(item => item.symbol === 'XRPUSDT').price).toFixed(2);
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
💳 <b>Покупка</b>: XRP
💰 <b>Цена за ${cryptoAmount} XRP</b>: ${price} USD
💱 <b>Валюта</b>: ${currency.toUpperCase()}`, { parse_mode: 'HTML'});

			await ctx.reply('В течение дня Ваша заявка будет рассмотрена и человек свяжется с Вами по вопросу продажи');
			await ctx.telegram.sendMessage(401941163,`
📩 <b>Заявка</b>			
			
👤 <b>Пользователь</b>: @${ctx.from.username}
💱 <b>Тип криптовалюты</b>: XRP
💰 <b>Кол-во криптовалюты которую хочет купить</b>: ${cryptoAmount}
💳 <b>Стоимость</b>: ${price} ${currency.toUpperCase()}
🗒 <b>Тип заяки</b>: Покупка
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
				});

				const data = await response.json();
				const xrpToUsd = parseFloat(data.find(item => item.symbol === 'XRPUSDT').price);
				const usdtToUah = await getNbuUsdtToUah()

				console.log('usdtToUah: ', usdtToUah)

				const cryptoAmount = ctx.wizard.state.cryptoAmount;
				const currency = ctx.wizard.state.currency;
				const xrpPriceInUAH = (cryptoAmount * xrpToUsd) * usdtToUah;

				await ctx.replyWithMarkdown(`
⚠️ <b>ПРОЧИТАЙТЕ ВНИМАТЕЛЬНО</b>

👤 <b>Пользователь</b>: @${ctx.from.username}
💳 <b>Покупка</b>: XRP
💰 <b>Цена за ${cryptoAmount} XRP</b>: ${xrpPriceInUAH} UAH
💱 <b>Валюта</b>: ${currency.toUpperCase()}`, { parse_mode: 'HTML'});

				await ctx.reply('В течение дня Ваша заявка будет рассмотрена и человек свяжется с Вами по вопросу продажи');
				await ctx.telegram.sendMessage(401941163,`
📩 <b>Заявка</b>			
			
👤 <b>Пользователь</b>: @${ctx.from.username}
💱 <b>Тип криптовалюты</b>: XRP
💰 <b>Кол-во криптовалюты которую хочет купить</b>: ${cryptoAmount}
💳 <b>Стоимость</b>: ${xrpPriceInUAH} ${currency.toUpperCase()}
🗒 <b>Тип заяки</b>: Покупка
`, { parse_mode: 'HTML' })

				return ctx.scene.leave();

			} catch (e) {
				console.log('error: ', e)
			}
		}
	}
);

module.exports = buyCryptoXRPScene;
