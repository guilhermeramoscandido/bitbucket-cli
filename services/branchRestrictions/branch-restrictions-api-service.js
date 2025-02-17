import { BaseApiService } from "../base-api-service.js";
import { BranchRestriction } from "./dto/branchRestrictions.js";

/**
 * Service for managing branch restrictions in a Bitbucket repository.
 * Extends the BaseApiService to provide methods for listing, retrieving, creating, updating, and deleting branch restrictions.
 * 
 * @class BranchRestrictionApiService
 * @extends {BaseApiService}
 */
export class BranchRestrictionApiService extends BaseApiService {

    /**
     * Creates an instance of the service with the provided authentication token.
     * 
     * @constructor
     * @param {string} authToken - The authentication token to be used for API requests.
     */
    constructor(authToken) {
        super(authToken);
    }

    /**
     * Lists branch restrictions for a given repository.
     *
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repoSlug - The repository slug.
     * @returns {Promise<BranchRestriction[]>} A promise that resolves to an array of BranchRestriction objects.
     */
    async listBranchRestrictions(workspace, repoSlug) {
        const response = await this.get(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/branch-restrictions`);
        return response.values.map(branchRestrictionData => new BranchRestriction(branchRestrictionData.id, branchRestrictionData.kind, branchRestrictionData.pattern, branchRestrictionData.branch_type, branchRestrictionData.users, branchRestrictionData.groups, branchRestrictionData.value));

    }

    /**
     * Fetches branch restrictions for a specific repository.
     *
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repoSlug - The repository slug.
     * @param {string} id - The ID of the branch restriction.
     * @returns {Promise<BranchRestriction>} A promise that resolves to a BranchRestriction object.
     */
    async getBranchRestrictions(workspace, repoSlug, id) {
        const response = await this.get(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/branch-restrictions/${id}`);
        return new BranchRestriction(response.id, response.kind, response.pattern, response.branch_type, response.users, response.groups, response.value);

    }

    /**
     * Creates a branch restriction for a given repository in a specified workspace.
     *
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repoSlug - The repository slug.
     * @param {Object} payload - The payload containing branch restriction details.
     * @param {string} payload.kind - The type of restriction (e.g., "push", "delete").
     * @param {string} payload.pattern - The branch pattern to apply the restriction to.
     * @param {Array<string>} payload.users - The list of users to apply the restriction to.
     * @param {Array<string>} payload.groups - The list of groups to apply the restriction to.
     * @param {number} payload.value - The value associated with the restriction.
     * @returns {Promise<Object>} The response from the Bitbucket API.
     */
    async createBranchrestriction(workspace, repoSlug, payload) {
       const parameters = {
            kind: payload.kind,
            pattern: payload.pattern,
            users: payload.users,
            groups: payload.groups,
            value: payload.value
        };
        return await this.post(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/branch-restrictions`, parameters);
    }

    /**
     * Updates a branch restriction for a given repository.
     *
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repoSlug - The repository slug.
     * @param {number} id - The ID of the branch restriction to update.
     * @param {Object} payload - The payload containing the branch restriction details.
     * @param {string} payload.kind - The kind of branch restriction.
     * @param {string} payload.pattern - The branch pattern to apply the restriction to.
     * @param {Array<string>} payload.users - The users to apply the restriction to.
     * @param {Array<string>} payload.groups - The groups to apply the restriction to.
     * @param {number} payload.value - The value of the restriction.
     * @returns {Promise<Object>} The response from the Bitbucket API.
     */
    async updateBranchRestriction(workspace, repoSlug, id, payload) {
        const parameters = {
            kind: payload.kind,
            pattern: payload.pattern,
            users: payload.users,
            groups: payload.groups,
            value: payload.value
        };
        return await this.put(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/branch-restrictions/${id}`, parameters);
    }

    /**
     * Deletes a branch restriction from a Bitbucket repository.
     *
     * @param {string} workspace - The workspace ID or slug.
     * @param {string} repoSlug - The repository slug.
     * @param {number} id - The ID of the branch restriction to delete.
     * @returns {Promise<Object>} The response from the Bitbucket API.
     */
    async deleteBranchRestriction(workspace, repoSlug, id) {
        return await this.delete(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/branch-restrictions/${id}`);
    }
}