import { Amplify } from 'aws-amplify';

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID || '',
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID || '',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code' as const,
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: false,
        },
        family_name: {
          required: false,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
} as any;

export const configureAmplify = () => {
  Amplify.configure(amplifyConfig);
};


