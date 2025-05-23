# Telegram Bot Link
https://t.me/ChristiantoBBot

# System Design
![data-flow](<data-flow.png>)

# How to run
1. Ensure you have installed Node JS and Postgre SQL.
2. Change the username and password in .ENV file. For example 
`postgresql://[user]:[password]@localhost:5432/[database_name]`
3. Enter your Coin Gecko and Open AI API keys.
4. Open Terminal > npm install > npx prisma migrate dev --name init > Wait until installation is finished > npx npm run dev.
5. The service is ready.

# Commands
`/help`: List of commands that could be processed by the bots <br/>
`/info`: Information about the bot

Enter a coin token address to get AI analysis of coin safety.
For example: 7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr (Popcat)

The Prompt to the AI will be: Give insight about this coin and analyze the safety score (0-100) based on this data:
<your data in JSON>. Response only in this JSON format:
{
insight: string;
score: number;
}

Enter "What's the price of $<coin_symbol>?" to check for coin's market data. Ensure that you enter the coin's name after the '$' sign and don't forget the question mark.
For example: What's the price of $btc?

# .env file
Your .env file should consist of these lines:
```
DATABASE_URL="postgresql://[db_username]:[db_passwprd]@localhost:5432/[db_name]"
TELEGRAM_BOT_TOKEN="<your_telegram_bot_token>"
COIN_GECKO_API_KEY="<your_coin_gecko_api_key>"
OPENAI_API_KEY="<your_openai_api_key>"
```

# Demo
<video controls src="Screen Recording 2025-05-21 at 14.20.20.mov" title="Title"></video>