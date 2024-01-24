# Serverless Framework

[Serverless Framework](https://www.serverless.com/)
The Serverless Framework is used to build and deploy this project to AWS.

## Installation

[Getting Started](https://www.serverless.com/framework/docs/getting-started)

1. install serverless `curl -o- -L https://slss.io/install | bash` or `brew install serverless`
1. install the plugin `serverless plugin install -n serverless-deployment-bucket`
1. install the plugin `serverless plugin install -n serverless-plugin-resource-tagging`

1. install other serverless plug-ins as required

---

## Serverless.yml - Serverless Configuration File

[Serverless Framework](https://www.serverless.com/)

This file contains the code and configuration for the Service deployed to AWS by this repository. The Service may be composed of Lambda funtions and infrastructure needed to support the Service.

Serverless framework relies on the repository having a *serverless.yml* file. This file has 4 main headers.

1. Custom - contains variables for the stack defined in this section
2. Provider - contains information relevent to AWS account and region
3. Resources - contains cloudformation resource templates deployed by the stack
4. Layers - leverages the Serverless Framework to deploy Lambda Layers referenced in the LambdaFunctions stack
5. Other resources may be compliled and copied to S3 buckets as part of the deployment

---

## Serverless Deployment from a Local Development System

To deploy on a local development system, you must have AWS `aws_access_key_id` and `aws_secret_access_key` configured correctly to access your AWS account.

```{bash}
Common Serverless Commands


# print infrastructure as a syntax check
sls print --stage {stage_name}  --aws-profile {profile_name}


# deploy infrastructure to AWS
sls deploy --stage {stage_name}  --aws-profile {profile_name}


# remove infrastructure to AWS
sls remove --stage {stage_name}  --aws-profile {profile_name}

```

As part of the Deployment process, the Serverless Framework creates a S3 Bucket to store CloudFormation templates for all deployed environments.

---

## Serverless Deployment using GitHub Actions

For automated deployment via GitHub Actions, Secrets must be set by the repository administrator for `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

Deploy workflow is controlled by `.github/workflows/github-actions.yml`.  Deploy actions will run when code is merged into the branch for the desired environment.

---

## Branches for Automated Deploy to Environments

- Items will be deployed to an environment, as determined by the git branch name.

---

### GitHub Actions

- [Serverless Action](https://github.com/serverless/github-action)
- [Github Checkout](https://github.com/actions/checkout)
- [GitHub Action to Sync S3 Bucket](https://github.com/marketplace/actions/s3-sync)

---

[README](./README.md)

---
