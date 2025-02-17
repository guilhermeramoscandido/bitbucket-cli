import { Repository } from './dto/repository.js';
import { BaseApiService } from "../base-api-service.js";
import { User } from '../user/dto/user.js';

/**
 * Service class for interacting with the Bitbucket repository API.
 * 
 * @class RepositoryApiService
 * @extends {BaseApiService}
 */
export class RepositoryApiService extends BaseApiService {
    /**
     * Creates an instance of RepositoryApiService.
     * 
     * @param {string} authToken - The authentication token for API requests.
     */
    constructor(authToken) {
        super(authToken);
    }

    /**
     * Creates a new repository in the specified workspace.
     * 
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repo_slug - The repository slug.
     * @returns {Promise<void>} A promise that resolves when the repository is created.
     */
    async createRepository(workspace, repo_slug, project_key, description) {
        const data = {
            scm: 'git',
            project: {
                key: project_key
            },
            description: description,
            is_private: true
        };
        await this.post(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}`, data);
    }

    /**
     * Retrieves information about a specific repository.
     * 
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repo_slug - The repository slug.
     * 
     * @returns {Promise<Repository>} A promise that resolves to a Repository object.
     */
    async getRepository(workspace, repo_slug) {
        const response = await this.get(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}`);
        return new Repository(response.workspace, response.slug, response.scm, response.is_private, response.description, response.full_name, response.project);
    }

    /**
     * Lists repositories for a given workspace.
     *
     * @param {string} workspace - The workspace identifier.
     * @returns {Promise<Repository[]>} A promise that resolves to an array of Repository objects.
     * @throws {Error} If the request fails.
     */
    async listRepositories(workspace) {
        const response = await this.get(`https://api.bitbucket.org/2.0/repositories/${workspace}`);
        return response.values.map(repoData => new Repository(repoData.workspace, repoData.slug, repoData.scm, repoData.is_private, repoData.description, repoData.full_name, repoData.project));
    }

    /**
     * Adds a user to a repository with a specified permission.
     *
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repo_slug - The repository slug.
     * @param {string} user_uuid - The UUID of the user to be added.
     * @param {string} permission - The permission level to be granted to the user.
     * @returns {Promise<void>} - A promise that resolves when the user is added to the repository.
     */
    async addUserToRepository(workspace, repo_slug, user_uuid, permission) {
        const data = {
            permission: permission
        };
        await this.putWithAppPassword(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/permissions-config/users/${user_uuid}`, data);
    }

    /**
     * Lists all users in a specified repository.
     * @param {string} workspace - The workspace ID.
     * @param {string} repoSlug - The repository slug.
     * @returns {Promise<User[]>} An array of user data.
     */
    async listUsersInRepository(workspace, repoSlug) {
        const response = await this.get(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/permissions-config/users`);
        return response.values.map(userData => new User(userData.user.display_name, userData.user.uuid, userData.user.account_id, userData.user.nickname));
    }

    /**
     * Lists all users in a specified repository.
     * @param {string} workspace - The workspace ID.
     * @param {string} repoSlug - The repository slug.
     * @param {string} user_uuid - The UUID of the user to be removed.
     * @returns {Promise<User[]>} An array of user data.
     */
    async deleteUserInRepository(workspace, repoSlug, uuid) {
        return await this.deleteWithAppPassword(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/permissions-config/users/${uuid}`);
    }
}