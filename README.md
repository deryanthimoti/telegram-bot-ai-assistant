# Telegram Bot Link
https://t.me/ChristiantoBBot

# How to run

1. Ensure you have installed Node JS and Postgre SQL
2. Change the username and password in .ENV file. For example postgresql://<user>:<password>@localhost:5432/<database_name>
3. Open Terminal > npm install > Wait until installation is finished > npm run dev
4. The service is ready

# Commands
/help: List of commands that could be processed by the bots
/info: Information about the bot

# .env file
Your .env file should consist of these lines:
`DATABASE_URL="postgresql://<db_username>:<db_passwprd>@localhost:5432/<db_name>"
TELEGRAM_BOT_TOKEN="<your_telegram_bot_token>"
COIN_GECKO_API_KEY="<your_coin_gecko_api_key>"
OPENAI_API_KEY="<your_openai_api_key>"`
