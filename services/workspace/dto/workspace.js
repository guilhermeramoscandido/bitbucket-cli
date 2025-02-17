export class Workspace {
  constructor(data) {
    this.name = data.name;
    this.slug = data.slug;
    this.created_on = data.updated_on;
    this.updated_on = data.updated_on;
  }
}