import TelegramBot from 'node-telegram-bot-api';
import { logCommand } from './logger';
import { getCoinGeckoData } from './services/coinGecko';
import { formatPrice } from './utils/price';
import { parseCoinCommand } from './utils/parser';
import { addToCache } from './cache';

// Replace with your token
const token = process.env.TELEGRAM_BOT_TOKEN!;
export const bot = new TelegramBot(token, { polling: true });

// Define command handling
bot.onText(/\/(\w+)/, async (msg, match) => {
  const command = match?.[1];
  const userId = msg.from?.id.toString() || 'unknown';
  const username = msg.from?.username || 'unknown';

  if (command) {
    await logCommand(userId, username, command);

    // Customize responses
    let response = '';
    switch (command) {
      case 'start':
        response = 'Welcome! Send commands to log them.';
        break;
      case 'help':
        response = 'Available commands: /help, /info';
        break;
      case 'info':
        response = 'ChristiantoBBot is a Telegram Bot to check for Crypto Price and analyze your coins.';
        break;
      default:
        response = `Unknown command: /${command}, please use /help for more commands`;
    }
    bot.sendMessage(msg.chat.id, response);
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const userId = msg.from?.id.toString() || 'unknown';
  const username = msg.from?.username || 'unknown';

  const command = parseCoinCommand(text);

  if (command) {
    await logCommand(userId, username, text);
    // Check for coin data in cache
    const coinId = await addToCache(command.coinId.toLowerCase());
    if (coinId === null) {
      sendCoinNotFound(msg.chat.id);
    } else {
      const result = await getCoinGeckoData(coinId);
      if (result.error) {
        sendCoinNotFound(msg.chat.id);
      } else {
        let response = `💰${result.name}
Current Price: $${result.market_data.current_price.usd}
Volume 24h: $${formatPrice(result.market_data.total_volume.usd)}
Liquidity: $`;
        bot.sendMessage(msg.chat.id, response);
      }
    }
  } else sendCommandNotFound(chatId);
});

const sendCommandNotFound = (chatId: number) => {
  bot.sendMessage(chatId, `I'm sorry, we couldn't quite catch the prompt. Please try something else like: 
What's the price of $bitcoin?
What's the current price of $bitcoin?
  `)
};

const sendCoinNotFound = (chatId: number) => {
  bot.sendMessage(chatId, `I'm sorry, we couldn't find the coin that you specify. Please try something else.`);
};
