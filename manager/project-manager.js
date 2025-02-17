import { ProjectApiService } from "../services/project/project-api-service.js";
import inquirer from 'inquirer';
import Logger from '../logger/logger.js';

const logger = Logger(import.meta.url);

export class ProjectManager {
    projectKey;
    projectName;
    projectDescription;
    workspace;

    projectApiService = new ProjectApiService(process.env.BITBUCKET_TOKEN);

    constructor(workspace) {
        this.workspace = workspace;
    }

    async createProject() {
        return await this.projectApiService.createProject(this.workspace, this.projectKey, this.projectName, this.projectDescription);
    }

    async getProject() {
        try {
            const project = await this.projectApiService.getProject(this.workspace, this.projectKey);
            this.projectName = project.name
            this.projectDescription = project.description
            return project
        } catch (error) {
            return false
        }

    }

    async checkIfProjectExists() {
        const projects = await this.listProjects(this.workspace);
        const project = projects.filter(project => project.name === this.projectName)
        if (project.length > 0) {
            console.log(`Project already exists:\nName: ${project[0].name}\nKey: ${project[0].key}\nDescription: ${project[0].description}`);
            return project[0];
        }
        else return false;

    }

   
    async listProjects() {
        const projectsitories = await this.projectApiService.listProjects(this.workspace);
        return projectsitories;
    }


    async createProjectHandler() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter project name:',
            },
            {
                type: 'input',
                name: 'key',
                message: 'Enter project key:',
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter project description:',
            },
        ]);

        this.projectName = answers.name;
        this.projectKey = answers.key;
        this.projectDescription = answers.description;

        const project = await this.checkIfProjectExists();
        if (!project) {
            await this.createProject();
            console.log("Project created successfully.");
            logger.info(`${this.projectName}/${this.projectKey} - Project created successfully`)
        }
    }

}