import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';

// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
// const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'users';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);


export const onUserUpdated = functions.firestore.document('users/{id}').onWrite((change, context) => {
    // Get the note document
    const user = change.after.data();

    // Add an 'objectID' field which Algolia requires
    user.objectID = context.params.id;

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(user);
});