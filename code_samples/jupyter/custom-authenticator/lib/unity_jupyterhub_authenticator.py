"""
Unity JupyterHub Custom OAuthenticator to capture and pass Cognito tokens.client_id
This code is implemented based on https://oauthenticator.readthedocs.io/en/latest/writing-an-oauthenticator.html
"""
import json
import base64

from jupyterhub.auth import LocalAuthenticator
from tornado.auth import OAuth2Mixin
from tornado.httpclient import AsyncHTTPClient, HTTPError, HTTPRequest
from tornado.httputil import url_concat
from datetime import datetime
from oauthenticator.oauth2 import OAuthenticator, OAuthLoginHandler

class UnityOAuthenticator(OAuthenticator):

    COGNITO_AUTH_TOKEN_URL = "https://<DOMAIN_NAME>.auth.us-west-2.amazoncognito.com/oauth2/token"
    COGNITO_USER_INFO_URL = "https://<DOMAIN_NAME>.auth.us-west-2.amazoncognito.com/oauth2/userInfo"

    # login_service is the text displayed on the "Login with..." button
    login_service = "Unity Common Services"

    # This function gets called during the spawn of user specific docker container
    async def pre_spawn_start(self, user, spawner):

        auth_state = await user.get_auth_state()
        if not auth_state:
            # auth_state not enabled
            return

        # Pass Cognito tokens to spawner via environment variables
        spawner.environment['UNITY_COGNITO_ACCESS_TOKEN'] = auth_state['access_token']
        spawner.environment['UNITY_COGNITO_ID_TOKEN'] = auth_state['id_token']
        spawner.environment['UNITY_COGNITO_REFRESH_TOKEN'] = auth_state['refresh_token']

    async def authenticate(self, handler, data=None):
        # Exchange the OAuth code for an Access Token

        code = handler.get_argument("code")
        http_client = AsyncHTTPClient()

        # Encode client Id and secret
        message = self.client_id + ":" + self.client_secret
        message_bytes = message.encode('ascii')
        base64_bytes = base64.b64encode(message_bytes)
        base64_auth = base64_bytes.decode('ascii')

        params = dict(
            client_id=self.client_id, code=code, grant_type="authorization_code", redirect_uri=self.oauth_callback_url
        )

        url = url_concat(self.COGNITO_AUTH_TOKEN_URL, params)

        req = HTTPRequest(
            url, method="POST", headers={"Accept": "application/json", "Authorization":"Basic " + base64_auth, "Content-Type":"application/x-www-form-urlencoded"}, body=''
        )

        resp = await http_client.fetch(req)
        resp_json = json.loads(resp.body.decode('utf8', 'replace'))

        if 'access_token' in resp_json:
            access_token = resp_json['access_token']
            id_token = resp_json['id_token']
            refresh_token = resp_json['refresh_token']
        elif 'error_description' in resp_json:
            raise HTTPError(
                403,
                f"An access token was not returned: {resp_json['error_description']}",
            )
        else:
            raise HTTPError(500, f"Bad response: {resp}")

        req = HTTPRequest(
            self.COGNITO_USER_INFO_URL,
            method="GET",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        resp = await http_client.fetch(req)
        resp_json = json.loads(resp.body.decode('utf8', 'replace'))
        username = resp_json["username"]

        if not username:
            # No user is authenticated and login has failed
            return None

        return {
            'name': username,
            'auth_state': {
                'access_token': access_token,
                'id_token': id_token,
                'refresh_token': refresh_token,
            },
        }
