import TelegramBot from 'node-telegram-bot-api';
import { logCommand } from './logger';
import { getDexMarketDataByTokenAddress } from './services/dexScreener';
import { getCoinInsightAndSafetyScore } from './services/langchain';
import { getMessageType, parseCommand, parseCoinPrompt, parseAddress } from './utils/parser';
import { caching } from './cache';
import { MessageType } from './types';

const token = process.env.TELEGRAM_BOT_TOKEN!;
export const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const userId = msg.from?.id || -1;
  const username = msg.from?.username || 'unknown';

  const messageType: MessageType | null = getMessageType(text);

  if (!messageType) {
    sendCommandNotFound(chatId);
  } else if (messageType === 'COMMAND') {
    let command = parseCommand(text);
    await logCommand(userId, username, command);

    // Customize responses
    let response = '';
    switch (command) {
      case 'start':
        response = 'Welcome! Send commands to log them.';
        break;
      case 'help':
        response = `Available commands: 
/help: List of commands available 
/info: Information about ChrisBBot

Enter a coin token address to get AI analysis of coin safety.
For example: 7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr (Popcat)

Enter "What's the price of $<coin_symbol>?" to check for coin's market data. Ensure that you enter the coin's name after the '$' sign and don't forget the question mark.
For example: What's the price of $btc?
        `;
        break;
      case 'info':
        response = 'ChristiantoBBot is a Telegram Bot to check for Crypto Price and analyze your coins.';
        break;
      default:
        response = `Unknown command: /${command}, please use /help for more commands`;
    }
    bot.sendMessage(msg.chat.id, response);
  } else if (messageType === 'PROMPT') {
    let command = parseCoinPrompt(text);

    if (command?.coinId) {
      await logCommand(userId, username, text);
      // Check for coin data in cache
      const cacheResult = await caching(command.coinId.toLowerCase());
      if (cacheResult === null) {
        sendCoinNotFound(msg.chat.id);
      } else {
        let response = `💰${cacheResult.name}
Current Price: $${cacheResult.currentPrice}
Volume 24h: $${cacheResult.totalVolume}
Liquidity: $${cacheResult.liquidity}`;
          bot.sendMessage(msg.chat.id, response);
      }
    } else sendCommandNotFound(chatId);
  } else if (messageType === 'ADDRESS') {
    let command = parseAddress(text);

    if (command) {
      await logCommand(userId, username, text);
      const dexScreenerData = await getDexMarketDataByTokenAddress(text);

      if (dexScreenerData) {
        const insightAndSafetyScore = await getCoinInsightAndSafetyScore(dexScreenerData);
        let response = `📊 Token: ${dexScreenerData.name}
Chain: ${dexScreenerData.chainId}
Price: $${dexScreenerData.currentPrice}
Liquidity: $${dexScreenerData.liquidity}
Volume 24h: $${dexScreenerData.totalVolume}

🧠 AI Insight:
${insightAndSafetyScore.insight || `We couldn't give the insight for the time being`}

🛡️ Safety Score: ${insightAndSafetyScore.score || '?'}
(Estimated based on on-chain activity and liquidity metrics)
`;
        bot.sendMessage(msg.chat.id, response);
      } else {
        bot.sendMessage(chatId, `I'm sorry, we couldn't find the coin with the token address that you specify. Please try something else.`);
      }
    }
  }
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
