# fg-adb-locater

Uses serverless framework and ansible to deploy angular front-end pipelines along with the AWS infrastructure to host it.
---

## Description

AWS Lambda Functions and IAM Roles for Bus Locater
It is configured in *serverless.yml*.

---

## Iam Roles

Two IAM Roles are created for Cognito Authentication, appropriate with permissions.
No configuration should be required, other than in *serverless.yml*.

---

## Lambda Function

This is demo code, delete if not required.
It is configured in *serverless.yml*.

## Dependencies

### AWS Secrets Manager

A Secret named `${sls:stage}-${self:custom.project}-${self:service}` must be present in the same region as the Lambda Function.

Deploy this secret BEFORE deploying the Lambda Function.

The SecretString in AWS Secrets Manager should match the JSON format shown below.  Any secret values required by the Lambda Function should be added to the file in JSON format.

    {
        "USERNAME": "user",
        "PASSWORD": "CHANGEMEPLEASE"
    }


Tools for creating and updating secrets are located in `secrets/`.

Package `jq` is required for getsecret.sh to function correctly.

---

## Deployment

See [Deployment Setup](devops/DEPLOYMENT.md)

- Development Environment

```{}
    # print - useful for syntax check
    serverless print --stage dev

    # deploy
    serverless deploy --stage dev

    # rollback
    serverless rollback --stage dev

    # remove
    serverless remove --stage dev
```

- Production Environment

```{}
    # print - useful for syntax check
    serverless print --stage prod

    # deploy
    serverless deploy --stage prod

    # rollback
    serverless rollback --stage prod

    # remove
    serverless remove --stage prod
```

---

### Example File Heirarchy

This project may be extended to support multiple Lambda Functions and Layers

```{}
.
├── README.md
├── cf
│   ├── iam
│   │   └── role-dynamodb-to-aurora-exec.yml      <------ Additional IAM Roles go here
│   ├── lambda
│   │   ├── functions.yml              <------ Lambda Function config goes here
│   │   └── layers
│   │       └── psycopg2               <------ Additional Layers go here, 1 folder per layer
│   │           └── psycopg2.zip
│   └── stack-description.yml
├── devops
│   ├── DEPLOYMENT.md
│   └── buildspec.yml          <------ This buildspec should work for all environments
├── node_modules
│   └── ...
├── package-lock.json
├── package.json
├── secrets                    <------ Tools for maintatining AWS SecretsManager Secrets
│   ├── config
│   ├── create-secret.sh
│   ├── dev-lambda-dynamodb-to-aurora.json.example
│   ├── get-secret.sh
│   ├── list-secrets.sh
│   └── update-secret.sh
├── serverless.yml             <------ Deploy, Layer and Main Configuration are in this file
├── setup.sh
└── src
    └── dynamodb-to-aurora        <------ Additional Lambda Function Source Code goes here, 1 folder per function
        └── lambda_function.py

```

---
