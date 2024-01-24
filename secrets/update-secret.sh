#!/bin/sh
#
# update secret
#

. ./config

aws secretsmanager \
    update-secret \
    --profile ${PROFILE} \
    --secret-id ${SECRET_NAME} \
    --description "${SECRET_DESCRIPTION}" \
    --secret-string file://${SECRET_FILE_NAME}
