/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

/*
TODO:
Due to limitations of AWS Amplify deploying across AWS accounts this file has been checked in. 
Further enhancements can be made to use AWS Amplify to generate this file 
if accross AWS account support is enhanced, or to refactor all AWS Amplify references out.
*/

const awsmobile = {
    "aws_project_region": "us-east-1",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_GipoKnooh",
    "aws_user_pools_web_client_id": "1j115rd9lucobtrc7fjsf9g3r",
    "oauth": {
        "domain": "fg-rtblrr-userpool-dev.auth.us-east-1.amazoncognito.com",
        "scope": [
            "openid"
        ],
        "redirectSignIn": "http://localhost:4200/,https://dev.studentbustracking.com/",
        "redirectSignOut": "http://localhost:4200/,https://dev.studentbustracking.com/",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [
        "EMAIL"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_LOWERCASE",
            "REQUIRES_UPPERCASE",
            "REQUIRES_NUMBERS",
            "REQUIRES_SYMBOLS"
        ]
    },
    "aws_cognito_verification_mechanisms": []
};


export default awsmobile;
