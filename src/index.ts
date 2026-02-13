#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { VercelClient } from './vercel-client';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('vercel-bot')
  .description('CLI bot to manage Vercel projects')
  .version('1.0.0');

// Helper function to get Vercel token
function getVercelToken(): string {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error('Error: VERCEL_TOKEN environment variable is required');
    console.error('Please set your Vercel token: export VERCEL_TOKEN=your_token_here');
    process.exit(1);
  }
  return token;
}

// List projects command
program
  .command('list')
  .description('List all Vercel projects')
  .action(async () => {
    try {
      const client = new VercelClient(getVercelToken());
      const projects = await client.listProjects();
      
      if (projects.length === 0) {
        console.log('No projects found.');
        return;
      }

      console.log(`\nFound ${projects.length} project(s):\n`);
      projects.forEach((project) => {
        console.log(`  • ${project.name} (ID: ${project.id})`);
        if (project.framework) {
          console.log(`    Framework: ${project.framework}`);
        }
        console.log(`    Created: ${new Date(project.createdAt).toLocaleString()}\n`);
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get project command
program
  .command('get <project>')
  .description('Get details of a specific project')
  .action(async (project: string) => {
    try {
      const client = new VercelClient(getVercelToken());
      const projectData = await client.getProject(project);
      
      console.log('\nProject Details:');
      console.log(`  Name: ${projectData.name}`);
      console.log(`  ID: ${projectData.id}`);
      console.log(`  Account ID: ${projectData.accountId}`);
      console.log(`  Created: ${new Date(projectData.createdAt).toLocaleString()}`);
      if (projectData.framework) {
        console.log(`  Framework: ${projectData.framework}`);
      }
      if (projectData.buildCommand) {
        console.log(`  Build Command: ${projectData.buildCommand}`);
      }
      if (projectData.devCommand) {
        console.log(`  Dev Command: ${projectData.devCommand}`);
      }
      if (projectData.outputDirectory) {
        console.log(`  Output Directory: ${projectData.outputDirectory}`);
      }
      console.log();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Create project command
program
  .command('create <name>')
  .description('Create a new Vercel project')
  .option('-f, --framework <framework>', 'Framework to use (e.g., nextjs, react, vue)')
  .action(async (name: string, options: { framework?: string }) => {
    try {
      const client = new VercelClient(getVercelToken());
      const project = await client.createProject(name, options.framework);
      
      console.log('\n✓ Project created successfully!');
      console.log(`  Name: ${project.name}`);
      console.log(`  ID: ${project.id}`);
      if (project.framework) {
        console.log(`  Framework: ${project.framework}`);
      }
      console.log();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Delete project command
program
  .command('delete <project>')
  .description('Delete a Vercel project')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (project: string, options: { yes?: boolean }) => {
    try {
      if (!options.yes) {
        console.log(`\nWarning: This will permanently delete the project "${project}".`);
        console.log('Use --yes flag to confirm deletion.');
        process.exit(1);
      }

      const client = new VercelClient(getVercelToken());
      await client.deleteProject(project);
      
      console.log(`\n✓ Project "${project}" deleted successfully!\n`);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Deployments command
program
  .command('deployments <project>')
  .description('List deployments for a project')
  .option('-l, --limit <number>', 'Number of deployments to fetch', '10')
  .action(async (project: string, options: { limit?: string }) => {
    try {
      const client = new VercelClient(getVercelToken());
      const limit = parseInt(options.limit || '10', 10);
      const deployments = await client.listDeployments(project, limit);
      
      if (deployments.length === 0) {
        console.log(`\nNo deployments found for project "${project}".\n`);
        return;
      }

      console.log(`\nFound ${deployments.length} deployment(s) for "${project}":\n`);
      deployments.forEach((deployment) => {
        console.log(`  • ${deployment.url}`);
        console.log(`    UID: ${deployment.uid}`);
        console.log(`    State: ${deployment.state}`);
        console.log(`    Created: ${new Date(deployment.created).toLocaleString()}`);
        console.log(`    Creator: ${deployment.creator.username}\n`);
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// User info command
program
  .command('whoami')
  .description('Show authenticated user information')
  .action(async () => {
    try {
      const client = new VercelClient(getVercelToken());
      const user = await client.getUser();
      
      console.log('\nAuthenticated User:');
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  UID: ${user.uid}`);
      console.log();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
