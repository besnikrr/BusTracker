#!/bin/sh
#
#  install serverless dependencies locally
#     See devops/DEPLOYMENT.md for more information
#

serverless plugin install -n serverless-deployment-bucket
serverless plugin install -n serverless-plugin-resource-tagging
