#!/bin/sh
#
# get secret as JSON
#

. ./config

# read secret in json format
aws secretsmanager \
    get-secret-value \
    --profile ${PROFILE} \
    --secret-id ${SECRET_NAME} --query 'SecretString' | jq 'fromjson'
