# Mock API Consumer App for the Mozart Job Count Mock Endpoint

This is a reference implementation to use OAuth2.0 Client Credential flow in a Flask application.

In this example, this application acts as a consumer for the Mock Mozart Job Count API and uses
Client Credential flow to access the protected Mock Mozart Job Count API.

This example uses the Requests-OAuthlib and this code is implemented based on the following references:
- [RFC6749, section-4.4 - Client Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) - By Internet Engineering Task Force (IETF)
- [Client Credentials Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow) - By Auth0
- [Requests-OAuthlib: OAuth for Humans](https://requests-oauthlib.readthedocs.io/en/latest/index.html) - By Requests-OAuthlib
- [Requests-OAuthlib: Web Application Flow](https://requests-oauthlib.readthedocs.io/en/latest/oauth2_workflow.html#web-application-flow) - By Requests-OAuthlib

## Pre-Requisites

- Python3 installed on machine
- pip3 installed

## Install Additional Dependencies

Open a terminal and execute the following commands in application root directory.

```bash
pip3 install flask
pip3 install flasgger
pip3 install flask_cors
pip3 install requests_oauthlib
```

## Config Environment Variables in 

Open `run.sh` file and set environment variables to match with your setup.

#### **`run.sh`**
```bash
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
```

## Run Application

Execute the following command in the application root directory.

```bash
./run.sh
```

## Access the API Docs

* Open a web browser and access http://localhost:7070/apidocs 
* This will show a Swagger-UI that can be used to call the http://localhost:7070/job_count endpoint

## Call the Job Count Mock Endpoint with Curl

* Open a terminal and execute the following command.

```bash
curl -X GET "http://localhost:7070/job_count" -H  "accept: application/json"
```
* Above command should return the following output.

```json
{"counts":{"total":432},"success":true}
```

## Implementing the OAuth2.0 Client Credential flow

The OAuth2.0 Client Credential flow is implemented in this Mock API Consumer as follows in the `app.py`. Please note that 
Cognito configurations are read from the environment variables set in `run.sh`.

```python
@swag_from("job_count.yml", methods=['GET'])
@app.route("/job_count")
def job_count():

    # Read Cognito configurations from environment variables set in run.sh
    client_id = os.getenv('CLIENT_ID')
    client_secret = os.getenv('CLIENT_SECRET')
    token_endpoint = os.getenv('TOKEN_ENDPOINT')
    mozart_mock_job_count_endpoint = os.getenv('MOZART_MOCK_JOB_COUNT_ENDPOINT')

    # Authenticate with OAuth2.0 Client Credentials Flow
    auth = HTTPBasicAuth(client_id, client_secret)
    client = BackendApplicationClient(client_id=client_id)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(token_url=token_endpoint, auth=auth)
    response = oauth.get(url=mozart_mock_job_count_endpoint)
    return response.json()
```
