#!/bin/sh
#
# create secret
#

. ./config

aws secretsmanager \
    create-secret \
    --profile ${PROFILE} \
    --name ${SECRET_NAME} \
    --description "${SECRET_DESCRIPTION}" \
    --secret-string file://${SECRET_FILE_NAME}
