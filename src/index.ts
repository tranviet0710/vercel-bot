import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';
import { VercelClient } from './vercel-client';

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const vercelToken = process.env.VERCEL_TOKEN;
const vercelTeamId = process.env.VERCEL_TEAM_ID;
const vercelProjectName = process.env.VERCEL_PROJECT_NAME;

if (!botToken) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

if (!vercelToken) {
  console.error('Error: VERCEL_TOKEN is not set in environment variables');
  process.exit(1);
}

const bot = new Telegraf(botToken);
const vercelClient = new VercelClient(vercelToken, vercelTeamId, vercelProjectName);

// Start command
bot.command('start', async (ctx: Context) => {
  const welcomeMessage = `
🤖 *Welcome to Vercel Deployment Bot!*

This bot helps you manage your Vercel deployments directly from Telegram.

*Available Commands:*
/start - Show this welcome message
/deployments - List recent deployments
/status <deployment_id> - Check specific deployment status
/deploy - Trigger a new deployment
/cancel <deployment_id> - Cancel a deployment
/help - Show help information

Get started by checking your recent deployments with /deployments
  `;
  await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
});

// Help command
bot.command('help', async (ctx: Context) => {
  const helpMessage = `
📚 *Vercel Bot Help*

*Commands:*
• \`/deployments\` - Shows your 5 most recent deployments
• \`/status <id>\` - Get detailed status of a specific deployment
• \`/deploy\` - Trigger a new deployment (redeploys latest)
• \`/cancel <id>\` - Cancel a running deployment

*Deployment States:*
✅ READY - Deployment is live
🔨 BUILDING - Currently building
❌ ERROR - Deployment failed
⚡ INITIALIZING - Starting up
⏳ QUEUED - Waiting to start
🚫 CANCELED - Deployment canceled

*Examples:*
\`/status dpl_abc123\`
\`/cancel dpl_abc123\`

Need more help? Visit [Vercel Documentation](https://vercel.com/docs)
  `;
  await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
});

// List deployments command
bot.command('deployments', async (ctx: Context) => {
  try {
    await ctx.reply('🔍 Fetching your deployments...');
    
    const deployments = await vercelClient.getDeployments(5);
    
    if (deployments.length === 0) {
      await ctx.reply('No deployments found.');
      return;
    }

    let message = '📦 *Recent Deployments:*\n\n';
    deployments.forEach((deployment, index) => {
      message += `${index + 1}. ${vercelClient.formatDeploymentStatus(deployment)}\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error: any) {
    console.error('Error in /deployments:', error);
    await ctx.reply(`❌ Error: ${error.message}`);
  }
});

// Get deployment status command
bot.command('status', async (ctx: Context) => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('❌ Invalid message format');
      return;
    }

    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
      await ctx.reply('❌ Please provide a deployment ID.\nUsage: `/status <deployment_id>`', { parse_mode: 'Markdown' });
      return;
    }

    const deploymentId = args[1];
    await ctx.reply('🔍 Fetching deployment status...');

    const deployment = await vercelClient.getDeployment(deploymentId);
    const statusMessage = `📊 *Deployment Status*\n\n${vercelClient.formatDeploymentStatus(deployment)}`;

    await ctx.reply(statusMessage, { parse_mode: 'Markdown' });
  } catch (error: any) {
    console.error('Error in /status:', error);
    await ctx.reply(`❌ Error: ${error.message}`);
  }
});

// Trigger deployment command
bot.command('deploy', async (ctx: Context) => {
  try {
    await ctx.reply('🚀 Triggering new deployment...');

    const result = await vercelClient.triggerDeployment();
    
    await ctx.reply(
      `✅ Deployment triggered successfully!\n\n` +
      `🔗 URL: https://${result.url}\n` +
      `🆔 ID: \`${result.uid}\`\n\n` +
      `Use /status ${result.uid} to check progress.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error: any) {
    console.error('Error in /deploy:', error);
    await ctx.reply(`❌ Error: ${error.message}\n\nNote: This feature requires project configuration. Make sure VERCEL_PROJECT_NAME is set.`);
  }
});

// Cancel deployment command
bot.command('cancel', async (ctx: Context) => {
  try {
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply('❌ Invalid message format');
      return;
    }

    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
      await ctx.reply('❌ Please provide a deployment ID.\nUsage: `/cancel <deployment_id>`', { parse_mode: 'Markdown' });
      return;
    }

    const deploymentId = args[1];
    await ctx.reply('🛑 Canceling deployment...');

    await vercelClient.cancelDeployment(deploymentId);

    await ctx.reply(`✅ Deployment \`${deploymentId}\` has been canceled.`, { parse_mode: 'Markdown' });
  } catch (error: any) {
    console.error('Error in /cancel:', error);
    await ctx.reply(`❌ Error: ${error.message}`);
  }
});

// Error handling
bot.catch((err: any, ctx: Context) => {
  console.error('Bot error:', err);
  ctx.reply('❌ An unexpected error occurred. Please try again later.');
});

// Start the bot
bot.launch().then(() => {
  console.log('✅ Vercel Telegram Bot is running...');
  console.log('Press Ctrl+C to stop the bot');
});

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGTERM');
});
