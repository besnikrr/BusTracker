#!/bin/sh
#
# list secrets
#

. ./config

# read secret in json format
aws secretsmanager \
    list-secrets \
    --profile ${PROFILE}