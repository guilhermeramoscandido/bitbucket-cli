import { BaseApiService } from "../base-api-service.js";
import { Project } from "./dto/project.js";

/**
 * ProjectApiService class provides methods to interact with Bitbucket's project API.
 * Extends the BaseApiService class.
 */
export class ProjectApiService extends BaseApiService {
    /**
     * Creates an instance of ProjectApiService.
     * @param {string} authToken - The authentication token.
     */
    constructor(authToken) {
        super(authToken);
    }

    /**
     * Creates a new project in the specified workspace.
     * @param {string} workspace - The workspace ID.
     * @param {string} key - The project key.
     * @param {string} name - The project name.
     * @param {string} description - The project description.
     * @returns {Promise<Object>} The created project data.
     */
    async createProject(workspace, key, name, description) {
        const parameters = {
            key: key,
            name: name,
            description: description
        }
        return await this.post(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects`, parameters);
    }


    /**
     * Retrieves a project by its key from the specified workspace.
     * @param {string} workspace - The workspace ID.
     * @param {string} key - The project key.
     * @returns {Promise<Project>} The project data.
     */
    async getProject(workspace, key) {
        const response = await this.get(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects/${key}`);
        return new Project(response.name, response.description, response.is_private, response.created_on, response.updated_on);
    }

    /**
     * Updates an existing project in the specified workspace.
     * @param {string} workspace - The workspace ID.
     * @param {string} key - The project key.
     * @param {string} name - The new project name.
     * @param {string} description - The new project description.
     * @returns {Promise<Object>} The updated project data.
     */
    async updateProject(workspace, key, name, description) {
        const parameters = {
            name: name,
            description: description
        }
        return await this.put(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects/${key}`, parameters);
    }
    /**
     * Lists all projects in the specified workspace.
     * @param {string} workspace - The workspace ID.
     * @returns {Promise<Project[]>} An array of project data.
     */
    async listProjects(workspace) {
        const response = await this.get(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects`);
        return response.values.map(projectData => new Project(projectData.name, projectData.description, projectData.is_private, projectData.created_on, projectData.updated_on, projectData.key));
    }

    /**
     * Lists all users in a specified project.
     * @param {string} workspace - The workspace ID.
     * @param {string} projectKey - The project key.
     * @returns {Promise<User[]>} An array of user data.
     */
    async listUsersInProject(workspace, projectKey) {
        const response = await this.get(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects/${projectKey}/permissions-config/users`);
        return response.values.map(userData => new User(userData.user.display_name, userData.user.uuid, userData.user.account_id, userData.user.nickname));
    }
    /**
     * Retrieves a user from a specified project by their UUID.
     * @param {string} workspace - The workspace ID.
     * @param {string} projectKey - The project key.
     * @param {string} userUuid - The user's UUID.
     * @returns {Promise<Object>} The user data.
     */
    async getUserFromProject(workspace, projectKey, userUuid) {
        return await this.get(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects/${projectKey}/permissions-config/users/${userUuid}`);
    }


    /**
     * Adds a user to a specified project with a given permission.
     * @param {string} workspace - The workspace ID.
     * @param {string} projectKey - The project key.
     * @param {string} userUuid - The user's UUID.
     * @param {string} permission - The permission level.
     * @returns {Promise<Object>} The response data.
     */
    async addUserToProject(workspace, projectKey, userUuid, permission) {
        const parameters = {
            permission: permission
        }
        return await this.put(`https://api.bitbucket.org/2.0/workspaces/${workspace}/projects/${projectKey}/permissions-config/users/${userUuid}`, parameters);
    }
}