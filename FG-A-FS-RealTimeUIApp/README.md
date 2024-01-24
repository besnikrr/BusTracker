# First Student Real Time Web App - Bus Locator & Route Replay

## Project Overview

First Student is the largest provider of school bus services in North America. This project will provide two real-time features as part of their bigger FOCUS 2.0 initiative. These two real-time features include Bus Locator & Route Replay. These features will be used by dispatchers who are located in a bus depot (hub, lob) to coordinate and manage the various details that go into effectively and essentially getting kids to and from school. There are several pieces involved: drivers, buses, routes, locations, schools, districts, and students.

Bus Locator is seeing the real time locations of multiple busses. This uses real-time GPS data.
Route Replay is seeing the planned and actual routes defined for buses. This uses planned routed and real-time GPS data for the actual route a bus takes.

To learn more about the project, please refer to this presentation:

[FOCUS 2.0 Bus Locator & Route Replay | Project Kickoff​](https://hubbardstate.sharepoint.com/:p:/r/_layouts/15/Doc.aspx?sourcedoc=%7B4FF517E7-E028-4728-86CE-F4B8AF3438B4%7D&file=First%20Student%20Project%20Kickoff%20Dec%202022.pptx&action=edit&mobileredirect=true&cid=117d3d07-5123-43b4-a83d-cfc0b816ba49)



## Getting Started
1. Install necessary tools
    - Brew (https://brew.sh/)
    - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    - VS Code
    - Git
    - NVM (https://github.com/nvm-sh/nvm#manual-install) (for git bash windows you may need to disable ssl, there are instructions for this in API project readme)
    - Node.JS (node v18.12.1 with npm v8.19.2)
    - Yarn
      ```shell
      npm i -g yarn
      ```
    - Angular CLI (issue with yarn PATH on windows use npm for global imports `npm install -g @angular/cli`))
      ```shell
      yarn global add @angular/cli
      ```
2. Get necessary access
    - AWS Access
    - Setup SSH connection
        - Mac: https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-ssh-unixes.html#setting-up-ssh-unixes-account
        - Windows: https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-ssh-windows.html
3. Clone repo 
    - Repo: https://us-east-1.console.aws.amazon.com/codesuite/codecommit/repositories/FG-A-FS-RealTimeUIApps/setup?region=us-east-1
    - Clone URL: ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/FG-A-FS-RealTimeUIApps
4. Configure AWS (Take default for everything unless defined)
    - `amplify configure`
        - `us-east-1`
    - `amplify pull`
        - Use profile created from the configure step
5. Start Development!
    - `yarn install`
    - `ng serve` (use `USE_LOCAL_API=true ng serve` to use local "serverless offline" backend)

## Branch, Commit, Pull Request, Build, and Deployment

### Branching
- All Development should work against the `dev` branch
- Branch names should be based off the template: `<change-type>/<dev-name>/<ticket-number>-<description>`
  - `change-type` is either `bug`, `feature`, or `chore`
  - `dev-name` is your first name or nickname in all lower case letters
  - `ticket-numer` is the JIRA ticket, capitalized and with dashes removed. For example, `RTBLRR75`
  - `description` is a short, all lowercase, dash separated description. For example, `my-update`
  - Example branch name: `feature/shah/RTBLRR75-setup-sidebar`

### Commit Messages


### Pull Requests


## Coding Standards





## Application Commands
`ng generate component component-name` - generate a new component

`ng generate directive|pipe|service|class|guard|interface|enum|module`

`ng build` - to build the project. The build artifacts will be stored in the `dist/` directory.


`ng test` - execute the unit tests via [Karma](https://karma-runner.github.io).

`ng e2e` - execute the end-to-end tests


## Technical Overview

Framework and Languages:

- TS
- Angular 14
- Karma
- Jasmine
  Core Libraries:
- Angular Material
- TailwindCSS
- Trimble Maps
- AG Grid

This UI application will connect with AWS Cognito for authetication and API Gateway that serves mainly as a proxy to ADB API Gateways for any data.

AWS Stack:
- CodeCommit
- CodeBuild
- CodeDeploy
- Cognito
- API Gateway
- Route53
- Amplify
- CI/CD

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

## Environments

Dev - https://rtblrr-app-dev.studentbustracking.com
Prod - https://rtblrr-app.studentbustracking.com
