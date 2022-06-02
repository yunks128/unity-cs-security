# Open API Configs for WPS-T Endpoints of Unity API Gateway
This directory contains an Open API YAML file exported from the WPS-T 
endpoint setup from the Unity API Gateway. 

You may open the .yaml file in this directory, update the <API_GATEWAY_BASE_URL>, <WPST_REST_API_ALB_BASE_URL> and <LAMBDA_AUTHORIZER_URL> and import that to
the API Gateway as follows, if you want to recreate API Gateway configs.

https://docs.aws.amazon.com/apigateway/latest/developerguide/create-api-using-swagger.html