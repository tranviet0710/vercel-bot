# Vercel Telegram Bot 🤖

A Telegram bot for managing Vercel project deployments directly from your Telegram app. Monitor deployments, check status, trigger new deploys, and cancel deployments with simple commands.

## Features

- 📊 **List Deployments**: View your recent Vercel deployments
- 🔍 **Check Status**: Get detailed status of specific deployments
- 🚀 **Trigger Deployments**: Start new deployments remotely
- 🛑 **Cancel Deployments**: Stop deployments in progress
- ✨ **Real-time Updates**: Get instant feedback on deployment states

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher)
2. **A Vercel Account** with API access
3. **A Telegram Bot Token** from [@BotFather](https://t.me/botfather)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tranviet0710/vercel-bot.git
cd vercel-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Get this from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Get this from https://vercel.com/account/tokens
VERCEL_TOKEN=your_vercel_api_token_here

# Optional: Your Vercel team ID (if using team account)
VERCEL_TEAM_ID=your_vercel_team_id_here

# Optional: Default project name for deployments
VERCEL_PROJECT_NAME=your_project_name_here
```

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Getting Your Credentials

### Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the token provided by BotFather

### Vercel API Token

1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name and set appropriate scope
4. Copy the generated token

### Vercel Team ID (Optional)

1. Go to your [Vercel Team Settings](https://vercel.com/teams)
2. Your Team ID is in the URL: `vercel.com/teams/[TEAM_ID]/settings`

## Bot Commands

Once your bot is running, use these commands in Telegram:

- `/start` - Welcome message and bot introduction
- `/help` - Display help information and available commands
- `/deployments` - List your 5 most recent deployments
- `/status <deployment_id>` - Check the status of a specific deployment
- `/deploy` - Trigger a new deployment (requires VERCEL_PROJECT_NAME)
- `/cancel <deployment_id>` - Cancel a running deployment

### Example Usage

```
/deployments
/status dpl_abc123xyz
/deploy
/cancel dpl_abc123xyz
```

## Deployment States

The bot uses emoji indicators for different deployment states:

- ✅ **READY** - Deployment is live and accessible
- 🔨 **BUILDING** - Deployment is currently building
- ❌ **ERROR** - Deployment failed with errors
- ⚡ **INITIALIZING** - Deployment is initializing
- ⏳ **QUEUED** - Deployment is waiting in queue
- 🚫 **CANCELED** - Deployment was canceled

## Project Structure

```
vercel-bot/
├── src/
│   ├── index.ts          # Main bot application
│   └── vercel-client.ts  # Vercel API client
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## Development

### Building

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

### Code Structure

- **index.ts**: Main bot logic with Telegraf setup and command handlers
- **vercel-client.ts**: Vercel API wrapper with deployment management methods

## Troubleshooting

### Bot doesn't respond

- Verify your `TELEGRAM_BOT_TOKEN` is correct
- Make sure the bot is running (`npm start`)
- Check console logs for errors

### Cannot fetch deployments

- Verify your `VERCEL_TOKEN` is valid and has correct permissions
- Check if `VERCEL_TEAM_ID` is set correctly (if using team account)
- Ensure you have deployments in your Vercel account

### Deploy command fails

- Set the `VERCEL_PROJECT_NAME` environment variable
- Ensure the project name matches exactly with your Vercel project
- Verify you have necessary permissions to deploy

## Security Notes

- Never commit your `.env` file to version control
- Keep your Telegram bot token and Vercel API token secure
- Use environment variables for all sensitive configuration
- Consider implementing authentication to restrict bot access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/tranviet0710/vercel-bot/issues)
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Telegraf Documentation](https://telegraf.js.org/)

## Acknowledgments

- Built with [Telegraf](https://telegraf.js.org/) - Modern Telegram Bot Framework
- Powered by [Vercel API](https://vercel.com/docs/rest-api)
- TypeScript for type safety and better development experience