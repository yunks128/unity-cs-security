#!/bin/sh

# OAuth Client ID
export CLIENT_ID=<ADD_CLIENT_ID_HERE>

# OAuth Client Secret
export CLIENT_SECRET=<ADD_CLIENT_SECRET_HERE>

# Cognito token endpoint
export TOKEN_ENDPOINT=<COGNITO_USER_POOL_DOMAIN_URL>/oauth2/token

# The URL of the Mozart mock job count endpoint
export MOZART_MOCK_JOB_COUNT_ENDPOINT=<AWS_API_GATEWAY_URL>/mozart_rest_api/job_count

# This environment variable is required to allow HTTP, instead of HTTPS (for testing purposes only)
export OAUTHLIB_INSECURE_TRANSPORT=1

python3 app.py
