import axios, { AxiosInstance } from 'axios';

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  framework?: string;
  devCommand?: string;
  buildCommand?: string;
  outputDirectory?: string;
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  creator: {
    username: string;
  };
}

export interface VercelUser {
  uid: string;
  email: string;
  username: string;
  name?: string;
}

export class VercelClient {
  private client: AxiosInstance;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.client = axios.create({
      baseURL: 'https://api.vercel.com',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * List all projects
   */
  async listProjects(): Promise<VercelProject[]> {
    try {
      const response = await this.client.get('/v9/projects');
      return response.data.projects || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to list projects');
    }
  }

  /**
   * Get a specific project by name or id
   */
  async getProject(projectIdOrName: string): Promise<VercelProject> {
    try {
      const response = await this.client.get(`/v9/projects/${projectIdOrName}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to get project: ${projectIdOrName}`);
    }
  }

  /**
   * Create a new project
   */
  async createProject(name: string, framework?: string): Promise<VercelProject> {
    try {
      const response = await this.client.post('/v9/projects', {
        name,
        framework,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to create project: ${name}`);
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectIdOrName: string): Promise<void> {
    try {
      await this.client.delete(`/v9/projects/${projectIdOrName}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete project: ${projectIdOrName}`);
    }
  }

  /**
   * List deployments for a project
   */
  async listDeployments(projectIdOrName: string, limit: number = 10): Promise<VercelDeployment[]> {
    try {
      const response = await this.client.get(`/v6/deployments`, {
        params: {
          projectId: projectIdOrName,
          limit,
        },
      });
      return response.data.deployments || [];
    } catch (error) {
      throw this.handleError(error, `Failed to list deployments for project: ${projectIdOrName}`);
    }
  }

  /**
   * Get deployment by ID
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    try {
      const response = await this.client.get(`/v13/deployments/${deploymentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to get deployment: ${deploymentId}`);
    }
  }

  /**
   * Get information about the authenticated user
   */
  async getUser(): Promise<VercelUser> {
    try {
      const response = await this.client.get('/v2/user');
      return response.data.user;
    } catch (error) {
      throw this.handleError(error, 'Failed to get user information');
    }
  }

  private handleError(error: any, message: string): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error?.message || error.message;
      return new Error(`${message}: ${errorMessage} (Status: ${status})`);
    }
    return new Error(`${message}: ${error.message}`);
  }
}
