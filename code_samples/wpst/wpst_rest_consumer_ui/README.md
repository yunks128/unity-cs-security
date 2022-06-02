# A Sample ReactJS Application with Cognito Authentication to Access WPS-T Endpoints 

Following steps can be used to start a sample ReactJS application secured with Cognito authentication.

1) Clone the sample source code from https://github.com/unity-sds/unity-cs-security

```shell
git clone https://github.com/unity-sds/unity-cs-security.git
```

Note: If you want to try this in an EC2 instance on AWS, you may clone the source code inside
the EC2 instance.

2) Change the current directory to `unity-cs-security/code_samples/wpst/wpst_rest_consumer_ui`.

```shell
cd unity-cs-security/code_samples/wpst/wpst_rest_consumer_ui
```

3) Open the `/src/config/index.js` file.

```shell
vi src/config/index.js
```

4) Update the `/src/config/index.js` file with the correct configurations (you may contact the Unity CS team to get
the configurations. Tell you need to get the `<COGNITO_CLIENT_ID>` and `<COGNITO_REDIRECT_URL>` for `wpst-client` Client App configured in Unity Cognito User Pool and also the `<API_GATEWAY_BASE_URL>`).

```js
/ OAuth2 configs
exports.OAUTH2_CLIENT_ID = "<COGNITO_CLIENT_ID>";
exports.OAUTH2_REDIRECT_URI = "<COGNITO_REDIRECT_URL>";
exports.OAUTH2_PROVIDER_URL = "https://unity.auth.us-west-2.amazoncognito.com/oauth2";
exports.APP_VIEWER_GROUP_NAME = "Unity_Viewer";
exports.APP_ADMIN_GROUP_NAME = "Unity_Viewer";

// WPS-T Endpoint
exports.WPST_ENDPOINT_BASE_URL = "https://<API_GATEWAY_BASE_URL>/dev/ades_wpst";
```

Note: In the test setup used to develop this application, an AWS Application Load Balancer (ALB) was
used in front of the EC2 instance that was used to host the sample ReactJS application. Therefore, the
App Client in Cognito User Pool was configured by giving this ALB URL as the Callback URL.

6) Execute the following commands to start the application.

```shell
npm install

npm start
```

7) Access the application in a web browser (Note: in this example an ALB URL was used to access the sample
ReactJS application). Ignore the certificate error given due to the self-signed certificate by clicking on 
"Advanced" -> "Accept the Risk and Continue". Warning: Do not process like this in a production application. The self-signed 
certificate is used for the sample ReactJS application's ALB for demo purposes only.

![](https://github.com/unity-sds/unity-cs-security/blob/main/code_samples/wpst/screenshots/sample_reactjs_app/wpst-sample-reactjs-app-login.png)


8) Press "Login with Cognito".

9) Enter your Unity Cognito User Pool username and password.

![](https://github.com/unity-sds/unity-cs-security/blob/main/code_samples/wpst/screenshots/sample_reactjs_app/wpst-sample-reactjs-app-cognito-login.png)


10) The page will be redirected to the home page of the sample ReactJS App.

![](https://github.com/unity-sds/unity-cs-security/blob/main/code_samples/wpst/screenshots/sample_reactjs_app/wpst-sample-reactjs-app-home-page.png)


Notes: 

- If the page does not show WPS-T data, most probably you do not have any data 
loaded in the WPS-T endpoints. 
- You may Contact the development team of the WPS-T endpoints and get details on loading the 
WPS-T endpoint with data. 
- In this case, you have to pass an access token as an Authorization header (as `Bearer access_token`) while making 
a POST request to load data to WPS-T endpoints (these end points are available in the Unity API Gateway).
- An access token can be obtained by following the instructions in https://github.com/unity-sds/unity-cs/wiki/Getting-Cognito-JWT-Tokens-in-Command-Line (make sure to use the same WPS-T client specific  <COGNITO_CLIENT_ID> used in steps above).
- Alternatively, if you have successfully logged in to the sample ReactJS App above, you may use the "Inspect" menu of the web browser, check "Storage" -> "Local Storage" - Click on the Sample ReachJS App URL and get the access token as follows.

![](https://github.com/unity-sds/unity-cs-security/blob/main/code_samples/wpst/screenshots/sample_reactjs_app/wpst-sample-reactjs-app-access-token.png)

