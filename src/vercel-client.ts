import axios, { AxiosInstance } from 'axios';

export interface Deployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  creator: {
    uid: string;
    username: string;
  };
  meta?: {
    githubCommitRef?: string;
    githubCommitSha?: string;
    githubCommitMessage?: string;
  };
}

export interface DeploymentResponse {
  deployments: Deployment[];
  pagination: {
    count: number;
    next?: number;
  };
}

export class VercelClient {
  private client: AxiosInstance;
  private teamId?: string;
  private projectName?: string;

  constructor(token: string, teamId?: string, projectName?: string) {
    this.client = axios.create({
      baseURL: 'https://api.vercel.com',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    this.teamId = teamId;
    this.projectName = projectName;
  }

  async getDeployments(limit: number = 5): Promise<Deployment[]> {
    try {
      const params: any = { limit };
      if (this.teamId) {
        params.teamId = this.teamId;
      }
      if (this.projectName) {
        params.projectId = this.projectName;
      }

      const response = await this.client.get<DeploymentResponse>('/v6/deployments', { params });
      return response.data.deployments;
    } catch (error) {
      console.error('Error fetching deployments:', error);
      throw new Error('Failed to fetch deployments from Vercel');
    }
  }

  async getDeployment(deploymentId: string): Promise<Deployment> {
    try {
      const params: any = {};
      if (this.teamId) {
        params.teamId = this.teamId;
      }

      const response = await this.client.get<Deployment>(`/v13/deployments/${deploymentId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching deployment:', error);
      throw new Error('Failed to fetch deployment details');
    }
  }

  async triggerDeployment(projectName?: string): Promise<any> {
    try {
      const project = projectName || this.projectName;
      if (!project) {
        throw new Error('Project name is required to trigger deployment');
      }

      const params: any = {};
      if (this.teamId) {
        params.teamId = this.teamId;
      }

      // Trigger a redeploy of the latest deployment
      const deployments = await this.getDeployments(1);
      if (deployments.length === 0) {
        throw new Error('No deployments found to redeploy');
      }

      const response = await this.client.post(
        `/v13/deployments`,
        {
          name: project,
          target: 'production',
        },
        { params }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error triggering deployment:', error.response?.data || error.message);
      throw new Error('Failed to trigger deployment');
    }
  }

  async cancelDeployment(deploymentId: string): Promise<void> {
    try {
      const params: any = {};
      if (this.teamId) {
        params.teamId = this.teamId;
      }

      await this.client.patch(
        `/v12/deployments/${deploymentId}/cancel`,
        {},
        { params }
      );
    } catch (error) {
      console.error('Error canceling deployment:', error);
      throw new Error('Failed to cancel deployment');
    }
  }

  formatDeploymentStatus(deployment: Deployment): string {
    const statusEmoji: Record<string, string> = {
      'READY': '✅',
      'BUILDING': '🔨',
      'ERROR': '❌',
      'INITIALIZING': '⚡',
      'QUEUED': '⏳',
      'CANCELED': '🚫',
    };

    const emoji = statusEmoji[deployment.state] || '❓';
    const date = new Date(deployment.created).toLocaleString();
    const commitInfo = deployment.meta?.githubCommitMessage 
      ? `\n📝 ${deployment.meta.githubCommitMessage.substring(0, 50)}...`
      : '';

    return `${emoji} *${deployment.state}*\n` +
           `🔗 [${deployment.name}](https://${deployment.url})\n` +
           `👤 ${deployment.creator.username}\n` +
           `📅 ${date}${commitInfo}\n` +
           `🆔 \`${deployment.uid}\``;
  }
}
