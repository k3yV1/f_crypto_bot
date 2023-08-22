const { Scenes } = require('telegraf')
const exchangeRateScene = new Scenes.BaseScene('exchangeRateTypeScene')
const fetch = require('node-fetch')
exchangeRateScene.enter(async (ctx) => {
	try {
		const response = await fetch('https://api.binance.com/api/v3/ticker/price', {
			method: 'GET',
			headers: {
				'X-MBX-APIKEY': process.env.BINANCE_API_KEY
			}
		})

		const data = await response.json()

		const btcPrice = parseFloat(data.find(item => item.symbol === 'BTCUSDT').price).toFixed(2);
		const ltcPrice = parseFloat(data.find(item => item.symbol === 'LTCUSDT').price).toFixed(2);
		const ethPrice = parseFloat(data.find(item => item.symbol === 'ETHUSDT').price).toFixed(2);
		const xrpPrice = parseFloat(data.find(item => item.symbol === 'XRPUSDT').price).toFixed(2);

		const message = `Курс валют:

1 <b><a href="https://www.binance.com/ru-UA/price/bitcoin">BTC</a></b> ≈ ${btcPrice}$
1 <b><a href="https://www.binance.com/ru-UA/price/litecoin">LTC</a></b> ≈ ${ltcPrice}$
1 <b><a href="https://www.binance.com/ru-UA/price/ethereum">ETH</a></b> ≈ ${ethPrice}$
1 <b><a href="https://www.binance.com/ru-UA/price/xrp">XRP</a></b> ≈ ${xrpPrice}$
1 <b><a href="https://www.binance.com/ru-UA/price/tether">USDT</a></b> ≈ 1.00$`;

		ctx.reply(message, { parse_mode: 'HTML', disable_web_page_preview: true }).catch(error => console.log(error));

	} catch (e) {
		console.log(e)
	}
})

exchangeRateScene.leave()

module.exports = exchangeRateScene