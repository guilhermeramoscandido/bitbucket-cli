export class BranchRestriction{ 
    constructor(id, kind, pattern, branch_type, users, groups, value){
        this.id = id;
        this.kind = kind;
        this.pattern = pattern;
        this.branch_type = branch_type;
        this.users = users;
        this.groups = groups;
        this.value = value;
    }
}