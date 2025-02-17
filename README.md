# Bitbucket CLI

Bitbucket CLI is a command-line tool to manage your Bitbucket repositories, projects, users, and branch permissions.

## Features

- Create and manage projects
- Create and manage repositories
- Add or remove users
- Configure branch permissions

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Set your Bitbucket authentication token as an environment variable:
    ```sh
    export BITBUCKET_TOKEN=<your-auth-token>
    ```

2. Run the CLI:
    ```sh
    node index.js
    ```

## Commands

First, you need to select which workspace in Bitbucket you want to manage. Use the arrow keys to navigate through the list and press Enter to select the desired workspace.

### Create Project

The "Create Project" command allows you to create a new project within your Bitbucket workspace. Here are the steps to use this command:

1. Choose the "Create Project" option from the CLI menu.
2. Enter the project name.
    - The CLI will prompt you to enter a name for the new project.
    - Type the desired name and press Enter.
3. Enter the project key.
    - The CLI will prompt you to enter a key for the new project.
    - The project key is a short identifier for the project, typically 2-10 characters long.
    - Type the desired key and press Enter.
4. Enter the project description.
    - The CLI will prompt you to enter a description for the new project.
    - Type the desired description and press Enter.
5. Confirm the creation of the project.

If the project already exists, the CLI will display a message indicating that the project already exists and will not create a duplicate project.

The CLI will then create the new project in your Bitbucket workspace and display a success message once the project is created.

### Create Repository

The "Create Repository" command allows you to create a new repository within a selected project. Here are the steps to use this command:

1. Choose the "Create Repository" option from the CLI menu.
2. Select the project for the new repository from the list of available projects.
    - The CLI will display a list of all projects in your workspace.
    - Use the arrow keys to navigate through the list and press Enter to select the desired project.
3. Enter the repository name.
    - The CLI will prompt you to enter a name for the new repository.
    - Type the desired name and press Enter.
4. Enter the repository description.
    - The CLI will prompt you to enter a description for the new repository.
    - Type the desired description and press Enter.
5. Confirm the creation of the repository.

If the repository already exists, the CLI will display a message indicating that the project already exists and will not create a duplicate repository.

The CLI will then create the new repository in your Bitbucket workspace and display a success message once the repository is created.

### Manage Repository

The "Manage Repository" command allows you to perform various operations on your existing repositories. Here are the steps to use this command:

1. Choose the "Manage Repository" option from the CLI menu.
2. Select the repository you want to manage from the list of available repositories or enter the repository name.
3. You can perform the following actions:
    - **Manage Branch Permissions**
    - **Add or Remove Users**

#### Manage Branch Permissions

The "Manage Branch Permissions" command allows you to configure branch restrictions to control who can push or merge changes to specific branches. Here are the steps to use this command:

1. Choose the "Manage Branch Permissions" option from the CLI menu.
2. Select the branch you want to configure permissions for.
3. You can perform the following actions:
    - **Create Branch Restriction**: Create a new branch restriction.
        1. Enter the branch name or pattern.
        2. Choose the kind of restriction:
            - Allow specific user to bypass pull request
            - Deny everyone from bypassing pull request
    - **List Branch Restrictions**: List all existing branch restrictions.
    - **Update Branch Restriction**: Update an existing branch restriction.
        1. Select the branch restriction you want to update.
        2. Choose the update option:
            - Allow everyone to bypass pull request
            - Allow specific user to bypass pull request
            - Remove specific user from bypassing pull request
            - Deny everyone from bypassing pull request
        3. Save the changes to apply the new permissions.

#### Add or Remove Users

The "Add or Remove Users" command allows you to manage the list of users who have access to the repository. Here are the steps to use this command:

1. Choose the "Add or Remove Users" option from the CLI menu.
2. You can perform the following actions:
    - **Add User**: Add a new user to the repository.
        1. List all users in the workspace.
        2. Select the user you want to add from the list.
        3. Choose the permission level for the user (e.g., read, write).
        4. Confirm the addition of the user to the repository.
    - **Remove User**: Remove an existing user from the repository.
        1. List all users who have access to the repository.
        2. Select the user you want to remove from the list.
        3. Confirm the removal of the user from the repository.


Follow the on-screen prompts to complete the desired action. Make sure you have the necessary permissions to manage the repository.

