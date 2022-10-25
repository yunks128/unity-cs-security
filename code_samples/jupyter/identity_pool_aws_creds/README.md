# Using Cognito Identity Pools to Get Temporary AWS Credentials by Providing a Cognito ID Token

The Jupyter Notebook  available in this directory is a working example to get temporary AWS credentials
by providing a Cognito ID token. This example is based on the approached explained in the
[Accessing AWS services using an identity pool after sign-in](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html) article and 
this shows a way to access an S3 bucket after authenticating a user with a Cognito user pool.

## Cognito Setup

### IAM Role

An IAM role was created with permission to access S3 buckets.

### Cognito User Pool 

A Cognito user pool should be available with,
a) At least one App Client (The client ID of this client will be used in  the Jupyter Notebook)
b) A user group associated with the IAM role created above

### Identity Pool

A Cognito identity pool should be created and associated with the IAM Role created above.


## Jupyter Notebook on Jupyter Lab

1) Login to JupyterHub to launch a JupyterLab 
2) Upload the Cognito-Identity-Pool-S3-Access.ipynb
3) Run -> Run All Cells
4) Enter the Cognito username and password when prompted
5) Observe the list of S3 buckets at the end of the Jupyter Notebook
