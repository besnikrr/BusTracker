#!/usr/bin/env bash

CHECKSUM_CHECK=$([[ " $* " == *" --check "* ]] && echo true || echo false)

OPENAPI_INPUT=api/first-student-openapi.yaml
OPENAPI_OUTPUT=src/first-student-openapi.ts

CHECKSUM_BEFORE=$(openssl md5 $OPENAPI_OUTPUT | awk '{ print $2 }')

yarn openapi-typescript $OPENAPI_INPUT --output $OPENAPI_OUTPUT

CHECKSUM_AFTER=$(openssl md5 $OPENAPI_OUTPUT | awk '{ print $2 }')

if [ "$CHECKSUM_CHECK" = true ] && [ "$CHECKSUM_BEFORE" != "$CHECKSUM_AFTER" ]; then
  echo "API generation has changes!"
  exit 1;
fi

exit 0;
