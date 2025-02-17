import { BaseApiService } from "../base-api-service.js";
import { Workspace } from "./dto/workspace.js";

/**
 * Service class for interacting with the Bitbucket Workspace API.
 * Extends the BaseApiService class.
 */
export class WorkspaceApiService extends BaseApiService {
    /**
     * Creates an instance of WorkspaceApiService.
     * @param {string} authToken - The authentication token for API requests.
     */
    constructor(authToken) {
        super(authToken);
    }

    /**
     * Retrieves a list of workspaces.
     * @returns {Promise<Workspace[]>} A promise that resolves to an array of Workspace objects.
     */
    async listWorkspaces() {
        const response = await this.get(`https://api.bitbucket.org/2.0/workspaces`);
        return response.values.map(workspaceData => new Workspace(workspaceData));
    }

    /**
     * Retrieves a specific workspace by its identifier.
     * @param {string} workspace - The identifier of the workspace.
     * @returns {Promise<Workspace>} A promise that resolves to a Workspace object.
     */
    async getWorkspace(workspace) {
        const response = await this.get(`https://api.bitbucket.org/2.0/workspaces/${workspace}`);
        return new Workspace(response);
    }
}