import * as admin from 'firebase-admin';
const serviceAccount = require("../service-account.json");

// createCustomToken() method requires a private key to mint custom tokens, which is not currently available 
// with the default credential (which happens to be an Application Default Credential)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  

export { createCustomToken } from './createCustomToken'
export { onUserUpdated } from './indexSearch'