import { ProjectApiService } from "../services/project/project-api-service.js";
import { RepositoryApiService } from "../services/repository/repository-api-service.js";
import inquirer from 'inquirer';
import { BranchRestrictionApiService } from "../services/branchRestrictions/branch-restrictions-api-service.js";
import { UserApiService } from "../services/user/user-api-service.js";
import Logger from '../logger/logger.js';

const logger = Logger(import.meta.url);

export class RespositoryManager {
    repoSlug = '';
    workspace;
    projectKey = '';
    description = '';

    repositoryApiService = new RepositoryApiService(process.env.BITBUCKET_TOKEN);

    constructor(workspace) {
        this.workspace = workspace;
    }

    async getRepository() {
        try {
            const repository = await this.repositoryApiService.getRepository(this.workspace, this.repoSlug);
            this.description = repository.description
            return repository;
        } catch (error) {
            return false
        }
    }

    async createRepository() {
        return await this.repositoryApiService.createRepository(this.workspace, this.repoSlug, this.projectKey, this.description);
    }

    async checkIfRepositoryExists() {
        const repository = await this.getRepository(this.workspace);
        if (repository) {
            console.log(`Repository already exists:\nName: ${repository.slug}\nProject: ${repository.project.key}\nDescription: ${repository.description}`);
            return repository
        }
        else return false;

    }

    async listProjects() {
        const projectsApiService = new ProjectApiService(process.env.BITBUCKET_TOKEN);
        const projects = await projectsApiService.listProjects(this.workspace);
        return projects;
    }

    async showAvailableProjectsPrompt(projects) {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose which project you want to create a new repository:',
                choices: projects.map(project => project.name),
            },
        ]);

        logger.info(`Selected project: ${command}`);

        return command
    }


    async showManageRepoOptions() {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What do you want?',
                choices: ['Enter repository name', 'List repositories'],
            },
        ]);

        logger.info(`Selected project: ${command}`);

        return command
    }
    async listRepositories() {
        const repositories = await this.repositoryApiService.listRepositories(this.workspace);
        return repositories;
    }

    async manageRepoHandlerWithRepoName() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter repository name:',
            }

        ]);
        this.repoSlug = answers.name;
        const repository = await this.checkIfRepositoryExists();
        if (!repository) throw new Error(`Repository ${this.repoSlug} does not exist.`);

        this.projectKey = repository.project.key;
        this.description = repository.description;

    }


    async manageRepoHandlerWithListRepos() {
        const repoList = await this.listRepositories();

        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose which repository you want to manage:',
                choices: repoList.map(repo => repo.slug),
            },
        ]);

        logger.info(`Selected repository: ${command}`);

        this.repoSlug = command;

    }

    async showAddRemoveUsersOrManageBranchRestrictions() {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What do you want?',
                choices: ['Add or remove users', 'Manage branch restrictions'],
            },
        ]);

        logger.info(`Selected project: ${command}`);

        return command
    }

    async manageRepositoryHandler() {
        const manageRepoOption = await this.showManageRepoOptions();
        if (manageRepoOption === 'Enter repository name') {
            await this.manageRepoHandlerWithRepoName();
        } else if (manageRepoOption === 'List repositories') {
            await this.manageRepoHandlerWithListRepos()
        }

        const selectedAction = await this.showAddRemoveUsersOrManageBranchRestrictions();

        if (selectedAction === 'Add or remove users') {
            await this.addRemoveUsersFromRepoHandler();
        }
        else if (selectedAction === 'Manage branch restrictions') {
            await this.manageBranchRestrictions();
        }


    }


    async showAddRemoveUsersFromRepoOptions() {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What do you want to do?',
                choices: ['Add user', 'Remove user'],
            },
        ]);

        logger.info(`Selected branch restriction: ${command}`);

        return command
    }

    async addRemoveUsersFromRepoHandler() {
        const selectedOption = await this.showAddRemoveUsersFromRepoOptions()

        if (selectedOption === 'Add user') {
            await this.addUserToRepo();

        } else if (selectedOption === 'Remove user') {
            await this.removeUserFromRepo();
        }

    }



    async addUserToRepo() {
        const usersInWorkspace = await this.listUsersInWorkspace()
        const usersToAdd = await this.showUsersFromWorkspace(usersInWorkspace)
        const filteredUser = usersInWorkspace.filter(user => user.displayName === usersToAdd)
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Select permission',
                choices: ['write', 'read'],
            },
        ]);
        await this.repositoryApiService.addUserToRepository(this.workspace, this.repoSlug, filteredUser[0].uuid, command)


    }

    async removeUserFromRepo() {
        const usersFromRepo = await this.repositoryApiService.listUsersInRepository(this.workspace, this.repoSlug);
        const usersToRemove = await this.showUsersFromWorkspace(usersFromRepo)
        const filteredUser = usersFromRepo.filter(user => user.displayName === usersToRemove)
        await this.repositoryApiService.deleteUserInRepository(this.workspace, this.repoSlug, filteredUser[0].uuid)
    }



    async createRepositoryHandler() {
        const projects = await this.listProjects();
        const selectedProject = await this.showAvailableProjectsPrompt(projects);

        const projectKey = projects.filter(project => project.name === selectedProject)[0].key;

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter repository name:',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Enter repository description:',
            },

        ]);

        this.repoSlug = answers.name;
        this.projectKey = projectKey;

        const repository = await this.checkIfRepositoryExists();
        if (!repository) {
            logger.info(`Creating repository: ${this.repoSlug}`);
            await this.createRepository();
            console.log("Repository created successfully.");
            logger.info(`${this.repoSlug} - Repository created successfully.`);
        }
    }

    async showBranchRestrictionsOptions() {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'What do you want to do?',
                choices: ['Create branch restriction', 'List branch restrictions', 'Update branch restriction'],
            },
        ]);

        logger.info(`Selected branch restriction: ${command}`);

        return command
    }

    async createBranchRestriction() {
        const createRestrictionAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter branch name or pattern:',
            },
            {
                type: 'list',
                name: 'kind',
                message: 'Choose the kind of restriction:',
                choices: [
                    'Allow specific user to bypass pull request',
                    'Deny everyone from bypassing pull request']
            }
        ]);

        logger.info(`Selection: ${createRestrictionAnswers.name}-${createRestrictionAnswers.kind}`)

        const payload = await this.checkWhichKindOfRestriction(createRestrictionAnswers.kind, createRestrictionAnswers.name);
        if (await this.checkIfBranchRestrictionExists(payload.pattern, payload.kind)) {
            console.log("Branch restriction already exists.");
            return;
        }
        const branchRestrictionsApiService = new BranchRestrictionApiService(process.env.BITBUCKET_TOKEN);
        await branchRestrictionsApiService.createBranchrestriction(this.workspace, this.repoSlug, payload);
        console.log("Branch restriction created successfully.");
        logger.info(`Branch restriction ${payload.pattern}-${payload.kind} updated successfully`)


    }

    async checkWhichKindOfRestriction(kind, pattern) {
        let payload = {};
        if (kind.includes('Allow specific user to bypass pull request')) {
            const users = await this.listUsersInWorkspace();

            const selectedUsers = await this.showUsersFromWorkspace(users);
            payload = {
                kind: 'push',
                pattern: pattern,
                users: [
                    {
                        uuid: users.filter(user => user.displayName === selectedUsers)[0].uuid
                    }
                ]
            }
        }
        else if (kind.includes('Deny everyone from bypassing pull request')) {
            payload = {
                kind: 'push',
                pattern: pattern,
                users: []
            }
        }

        return payload
    }


    async checkIfBranchRestrictionExists(pattern, kind) {
        const branchRestrictions = await this.listBranchRestrictions();
        return branchRestrictions.filter(branchRestriction => branchRestriction.pattern === pattern && branchRestriction.kind === kind).length > 0;
    }



    async showUsersFromWorkspace(users) {
        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose which user you want to add or remove:',
                choices: users.map(user => user.displayName || user.display_name),
            },
        ]);

        logger.info(`Selected users: ${command}`);

        return command
    }

    async listUsersInWorkspace() {
        const userApiService = new UserApiService(process.env.BITBUCKET_TOKEN);
        const users = await userApiService.listUsersInWorkspace(this.workspace);
        return users;
    }

    async listBranchRestrictions() {
        const branchRestrictionsApiService = new BranchRestrictionApiService(process.env.BITBUCKET_TOKEN);
        const branchRestrictions = await branchRestrictionsApiService.listBranchRestrictions(this.workspace, this.repoSlug);
        return branchRestrictions
    }

    async updateBranchRestriction(id, payload) {
        const branchRestrictionsApiService = new BranchRestrictionApiService(process.env.BITBUCKET_TOKEN);
        await branchRestrictionsApiService.updateBranchRestriction(this.workspace, this.repoSlug, id, payload);
        console.log("Branch restriction updated successfully.");
        logger.info(`Branch restriction ${id} updated successfully`)

    }

    async updateBranchRestrictionHandler() {
        const branchRestrictions = await this.listBranchRestrictions();

        const { command } = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Which one do you want to update?',
                choices: branchRestrictions.map(branchRestriction => `${branchRestriction.pattern}: ${branchRestriction.kind} -> Users: ${branchRestriction.users.map(x => x.display_name)}`),
            },
        ]);

        const selectedBranchRestriction = branchRestrictions.filter(branchRestriction => `${branchRestriction.pattern}: ${branchRestriction.kind} -> Users: ${branchRestriction.users.map(x => x.display_name)}` === command)[0];
        logger.info(`Selected restriction: ${JSON.stringify(selectedBranchRestriction)}`);

        const selectedOptionToUpdateRestriction = await this.showUpdateBranchRestrictionOptions();
        if (selectedOptionToUpdateRestriction.kind.includes('Allow everyone to bypass pull request')) {
            await this.deleteBranchRestriction(selectedBranchRestriction.id)

        }
        else if (selectedOptionToUpdateRestriction.kind.includes('Remove specific user from bypassing pull request')) {
            const selectedUsers = await this.showUsersFromWorkspace(selectedBranchRestriction.users);
            const newUsers = selectedBranchRestriction.users.filter(user => user.display_name !== selectedUsers)

            const payload = {
                users: newUsers
            }
            await this.updateBranchRestriction(selectedBranchRestriction.id, payload)
        } else if (selectedOptionToUpdateRestriction.kind.includes('Allow specific user to bypass pull request')) {
            const users = await this.listUsersInWorkspace();

            const selectedUsers = await this.showUsersFromWorkspace(users);

            const currentUsers = selectedBranchRestriction.users

            const newUserToAdd = {
                uuid: users.filter(user => user.displayName === selectedUsers)[0].uuid
            }

            currentUsers.push(newUserToAdd)
            const payload = {
                users: currentUsers
            }
            await this.updateBranchRestriction(selectedBranchRestriction.id, payload)

        } else if (selectedOptionToUpdateRestriction.kind.includes('Deny everyone from bypassing pull request')) {
            const payload = {
                kind: 'push',
                users: []
            }
            await this.updateBranchRestriction(selectedBranchRestriction.id, payload)
        }


    }

    async showUpdateBranchRestrictionOptions() {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'kind',
                message: 'Choose which user you want to add or remove:',
                choices: [
                    'Allow everyone to bypass pull request',
                    'Allow specific user to bypass pull request',
                    'Remove specific user from bypassing pull request',
                    'Deny everyone from bypassing pull request'
                ]
            },
        ]);
        logger.info(`Selected command: ${answers}`);
        return answers;
    }

    async deleteBranchRestriction(id) {
        const branchRestrictionsApiService = new BranchRestrictionApiService(process.env.BITBUCKET_TOKEN);
        await branchRestrictionsApiService.deleteBranchRestriction(this.workspace, this.repoSlug, id);
        console.log("Branch restriction deleted successfully.");
        logger.info(`Branch restriction ${id} deleted successfully`)

    }

    async manageBranchRestrictions() {
        const branchRestrictionOption = await this.showBranchRestrictionsOptions();

        if (branchRestrictionOption === 'Create branch restriction') {
            await this.createBranchRestriction();
        } else if (branchRestrictionOption === 'List branch restrictions') {
            const branchRestrictions = await this.listBranchRestrictions();
            console.log(branchRestrictions.map(branchRestriction => `${branchRestriction.pattern}: ${branchRestriction.kind} -> Users: ${branchRestriction.users.map(x => x.display_name)}`).join('\n'));
        } else if (branchRestrictionOption === 'Update branch restriction') {
            await this.updateBranchRestrictionHandler();
        }
    }

}
