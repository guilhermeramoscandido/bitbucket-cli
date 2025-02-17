export class Repository {
    constructor(workspace, slug, scm = 'git', is_private = true, description = '', full_name, project) {
        this.workspace = workspace;
        this.slug = slug;
        this.scm = scm;
        this.is_private = is_private;
        this.description = description;
        this.full_name = full_name;
        this.project = project;
    }
}