# Vercel Bot

A powerful CLI bot to manage your Vercel projects with ease. This tool provides a command-line interface to interact with the Vercel API for project management, deployment tracking, and more.

## Features

- 📋 List all your Vercel projects
- 🔍 Get detailed information about specific projects
- ➕ Create new projects with custom frameworks
- 🗑️ Delete projects (with confirmation)
- 🚀 View deployment history for projects
- 👤 Check authenticated user information

## Prerequisites

- Node.js 16.x or higher
- A Vercel account
- Vercel API token

## Installation

### From source

1. Clone the repository:
```bash
git clone https://github.com/tranviet0710/vercel-bot.git
cd vercel-bot
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Set up your environment:
```bash
cp .env.example .env
# Edit .env and add your VERCEL_TOKEN
```

### Global installation (optional)

To use the bot globally:
```bash
npm link
```

## Configuration

You need a Vercel API token to use this bot:

1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Create a new token
3. Copy the token and set it as an environment variable:

```bash
export VERCEL_TOKEN=your_token_here
```

Or create a `.env` file in the project root:
```
VERCEL_TOKEN=your_token_here
```

## Usage

### List all projects

```bash
npm start list
# or if installed globally
vercel-bot list
```

### Get project details

```bash
npm start get <project-name-or-id>
# or
vercel-bot get my-project
```

### Create a new project

```bash
npm start create <project-name>
# or with a framework
vercel-bot create my-app --framework nextjs
```

Supported frameworks include: `nextjs`, `create-react-app`, `vue`, `gatsby`, `nuxtjs`, `hugo`, and more.

### Delete a project

```bash
npm start delete <project-name-or-id> --yes
# or
vercel-bot delete my-project --yes
```

**Note:** The `--yes` flag is required to confirm deletion.

### List deployments

```bash
npm start deployments <project-name-or-id>
# or with a custom limit
vercel-bot deployments my-project --limit 20
```

### Check authenticated user

```bash
npm start whoami
# or
vercel-bot whoami
```

## Commands Reference

| Command | Description | Options |
|---------|-------------|---------|
| `list` | List all Vercel projects | - |
| `get <project>` | Get details of a specific project | - |
| `create <name>` | Create a new project | `-f, --framework <framework>` |
| `delete <project>` | Delete a project | `-y, --yes` (required) |
| `deployments <project>` | List deployments for a project | `-l, --limit <number>` |
| `whoami` | Show authenticated user info | - |

## Development

### Build the project

```bash
npm run build
```

### Run in development mode

```bash
npm run dev
```

## Project Structure

```
vercel-bot/
├── src/
│   ├── index.ts          # CLI entry point
│   └── vercel-client.ts  # Vercel API client
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## API Client

The `VercelClient` class provides a wrapper around the Vercel API with the following methods:

- `listProjects()` - Get all projects
- `getProject(id)` - Get a specific project
- `createProject(name, framework?)` - Create a new project
- `deleteProject(id)` - Delete a project
- `listDeployments(projectId, limit?)` - Get deployments
- `getDeployment(id)` - Get deployment details
- `getUser()` - Get authenticated user info

## Error Handling

The bot provides clear error messages for common issues:
- Missing or invalid Vercel token
- Project not found
- Network errors
- API rate limits

## Security

⚠️ **Never commit your `.env` file or expose your Vercel token!**

- Keep your `.env` file in `.gitignore`
- Use environment variables in production
- Rotate your tokens regularly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/tranviet0710/vercel-bot/issues)
- Check [Vercel API Documentation](https://vercel.com/docs/rest-api)

## Acknowledgments

Built with:
- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Axios](https://axios-http.com/)
- [Vercel API](https://vercel.com/docs/rest-api)