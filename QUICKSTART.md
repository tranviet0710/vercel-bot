# Quick Start Guide

## Prerequisites
- Node.js v16 or higher
- A Telegram account
- A Vercel account with API access

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Your Telegram Bot Token
1. Open Telegram and find @BotFather
2. Send `/newbot`
3. Follow prompts to name your bot
4. Copy the token BotFather gives you

### 3. Get Your Vercel API Token
1. Visit https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it (e.g., "telegram-bot")
4. Copy the generated token

### 4. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your tokens:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=team_xxxxxxxxx  # Optional, for team accounts
VERCEL_PROJECT_NAME=my-project  # Optional, for deployment commands
```

### 5. Build the Bot
```bash
npm run build
```

### 6. Start the Bot
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 7. Test Your Bot
1. Open Telegram
2. Search for your bot by username
3. Send `/start`
4. Try `/deployments` to list your Vercel deployments

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | Welcome message | `/start` |
| `/help` | Show help | `/help` |
| `/deployments` | List recent deployments | `/deployments` |
| `/status <id>` | Check deployment status | `/status dpl_abc123` |
| `/deploy` | Trigger new deployment | `/deploy` |
| `/cancel <id>` | Cancel a deployment | `/cancel dpl_abc123` |

## Troubleshooting

### Bot doesn't respond
- Check that the bot is running
- Verify your `TELEGRAM_BOT_TOKEN` is correct
- Look for errors in the console

### Can't see deployments
- Verify your `VERCEL_TOKEN` has the right permissions
- If using a team account, make sure `VERCEL_TEAM_ID` is set
- Check console for API errors

### Deploy command fails
- Set `VERCEL_PROJECT_NAME` in your `.env` file
- Ensure the project name matches your Vercel project exactly

## Running in Production

For production deployment, consider:

1. **Using PM2** for process management:
```bash
npm install -g pm2
pm2 start dist/index.js --name vercel-bot
pm2 save
```

2. **Using Docker**:
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

3. **Deploying to Vercel/Heroku/Railway** or any Node.js hosting platform

## Security Best Practices

- Never commit your `.env` file
- Rotate tokens regularly
- Use environment variables for all secrets
- Consider implementing user authentication
- Monitor bot usage and API calls

## Support

- Issues: https://github.com/tranviet0710/vercel-bot/issues
- Vercel Docs: https://vercel.com/docs
- Telegraf Docs: https://telegraf.js.org/
