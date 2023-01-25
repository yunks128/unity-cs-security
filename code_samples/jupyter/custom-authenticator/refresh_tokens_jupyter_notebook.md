```python
pip install boto3
```


```python
import os
import time
import boto3
import json

unity_cognito_access_token_expiry = int(os.environ.get('UNITY_COGNITO_ACCESS_TOKEN_EXPIRY'))
current_epoch_seconds = int(time.time())

# TODO change < to > in the following if condition. The < is used for testing only
if current_epoch_seconds < unity_cognito_access_token_expiry:
    
    # Get a new token
    client = boto3.client('cognito-idp', region_name='us-west-2')

    # Refresh Cognito tokens
    response = client.initiate_auth(
        ClientId='2bupi2qu71asn5dgjk1m3639aa',
        AuthFlow='REFRESH_TOKEN_AUTH',
        AuthParameters={
            'REFRESH_TOKEN': refresh_token,
            'SECRET_HASH': '<SECRET_HASH>'
        }
    )
    
    access_token = response['AuthenticationResult']['AccessToken']
    id_token = response['AuthenticationResult']['IdToken']
    access_token_expiry = current_epoch_seconds + int(response['AuthenticationResult']['ExpiresIn'])
    
    os.environ["UNITY_COGNITO_ACCESS_TOKEN"] = str(access_token)
    os.environ["UNITY_COGNITO_ID_TOKEN"] = str(id_token)
    os.environ["UNITY_COGNITO_ACCESS_TOKEN_EXPIRY"] = str(access_token_expiry)
    
print(os.environ.get('UNITY_COGNITO_ACCESS_TOKEN'))
```
