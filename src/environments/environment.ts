// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  auth0: {
    domain: 'techandcolor-dev.auth0.com',
    clientId: 'jOQZ0Q0hosJu1xZ54K1I2f7Ml3QM1FOZ',
    callbackURL: 'http://localhost:4200/auth/callback'
  },
  firebase: {
    apiKey: 'AIzaSyBUgvp3uyb2qQW3GRm2AafELBxg4pppaLU',
    authDomain: 'techandcolor-qa.firebaseapp.com',
    databaseURL: 'https://techandcolor-qa.firebaseio.com',
    projectId: 'techandcolor-qa'
  },
  googlePlaceKey: 'AIzaSyC6Num4ywNR9Ay2zJ69NiJCfI538hAINkQ'
};
