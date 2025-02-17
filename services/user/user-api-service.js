import { BaseApiService } from "../base-api-service.js";
import { User } from "./dto/user.js";

/**
 * UserApiService class that extends BaseApiService to interact with Bitbucket API for user-related operations.
 */
export class UserApiService extends BaseApiService {
    /**
     * Creates an instance of UserApiService.
     * @param {string} authToken - The authentication token for API requests.
     */
    constructor(authToken) {
        super(authToken);
    }

    /**
     * Fetches the list of users from Bitbucket.
     * @returns {Promise<Object>} The response object containing the list of users.
     */
    async listUsers() {
        const response = await this.get(`https://api.bitbucket.org/2.0/users`);
        return response;
    }

    /**
     * Fetches the list of users in a specific workspace from Bitbucket.
     * @param {string} workspace - The workspace identifier.
     * @returns {Promise<User[]>} An array of User objects representing the members of the workspace.
     */
    async listUsersInWorkspace(workspace) {
        const response = await this.get(`https://api.bitbucket.org/2.0/workspaces/${workspace}/members`);
        return response.values.map(userData => new User(userData.user.display_name, userData.user.uuid, userData.user.account_id, userData.user.nickname));
    }
}