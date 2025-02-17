import inquirer from 'inquirer';
import { ProjectManager } from './manager/project-manager.js';
import { WorkspaceApiService } from './services/workspace/workspace-api-service.js';
import { RespositoryManager } from './manager/repository-manager.js';
import Logger from './logger/logger.js';
import { RepositoryApiService } from './services/repository/repository-api-service.js';

const logger = Logger(import.meta.url);

export class BitbucketCLI {

  async setupCLI() {
    console.log('Bitbucket CLI - Manage your Bitbucket repositories');
    const workspacesApiService = new WorkspaceApiService(process.env.BITBUCKET_TOKEN);
    const workspaces = await workspacesApiService.listWorkspaces();


    const { command: selectedWorkspace } = await inquirer.prompt([
      {
        type: 'list',
        name: 'command',
        message: 'Choose your workspace:',
        choices: workspaces,
      },
    ]);

    logger.info(`Selected workspace: ${selectedWorkspace}`);

    const { command } = await inquirer.prompt([
      {
        type: 'list',
        name: 'command',
        message: 'What do you want to do?',
        choices: ['Create project', 'Create repository', 'Manage repository'],
      },
    ]);

    logger.info(`Selected command: ${command}`);


    if (command === 'Create project') {
      const projectManager = new ProjectManager(selectedWorkspace);
      await projectManager.createProjectHandler();
    } else if (command === 'Create repository') {
      const repositoryManager = new RespositoryManager(selectedWorkspace);
      await repositoryManager.createRepositoryHandler();
    } else if (command === 'Manage repository') {
      const repositoryManager = new RespositoryManager(selectedWorkspace);
      await repositoryManager.manageRepositoryHandler();
    }

  }

  async run() {
    
    this.setupCLI();

    
  }
}

