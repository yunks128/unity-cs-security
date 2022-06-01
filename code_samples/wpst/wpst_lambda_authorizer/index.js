// A token-based authorizer example to demonstrate how to use an authorization token to allow or deny a request based on
// Cognito user groups.

const { CognitoJwtVerifier } = require("aws-jwt-verify");

/**
 * Verifies a JWT token and check Cognito groups.
 */
exports.handler =  async(event, context, callback) => {
    var token = event.authorizationToken;
    console.log(token);

    var accessToken;

    if (token.startsWith("Bearer")) {
        accessToken = token.split(' ')[1];
        console.log("accessToken =" + accessToken);
    } else {
        console.log("Token not valid! Does not start with Bearer.");
        callback("Unauthorized");
    }

    /**
     * Verify JWT.
     *
     * References:
     * https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
     * https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens
     * https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
     * https://github.com/awslabs/aws-jwt-verify
     *
     **/

    // Verifier that expects valid access tokens
    const verifier = CognitoJwtVerifier.create({
            userPoolId: "<UNITY_COGNITO_USER_POOL_ID>",
            tokenUse: "access",
            clientId: "<CLIENT_ID_OF_WPST_CLIENT_APP_IN_COGNITO_USER_POOL>",
        });

    // Conduct access token verification
    try {
        const payload = await verifier.verify(accessToken);
        console.log("Token is valid. Payload:", payload);
    } catch (error) {
        console.log("Token not valid!");
        console.log(error);
        callback("Unauthorized");
    }


    /**
     * Verify the claims in the token.
     */

    // Check Cognito user groups
    var decoded;

    try {
        decoded = parseJwt(token);

    } catch (error) {
        console.log(error);
        callback("Unauthorized");
    }

    var groups = decoded['cognito:groups'];

    if (groups.includes("Unity_Viewer") || groups.includes("Unity_Admin")) {
        console.log("VALID TOKEN, ALLOW!!")
        callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } else {
        callback("Unauthorized");
    }

};

/**
 * Helper function to generate an IAM policy.
 */
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": true
    };
    return authResponse;
}

/**
 * Parses a JWT token.
 */
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(decode(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

/**
 * Decodes a base 64 encoded token.
 *
 * Reference: https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error
 *
 * @param b64Encoded
 * @returns {*}
 */

function decode(b64Encoded) {
    var converted = Buffer.from(b64Encoded, 'base64').toString()
    console.log(converted);
    return converted;
}
