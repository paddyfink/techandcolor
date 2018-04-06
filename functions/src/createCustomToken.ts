import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';
import * as jwks from 'jwks-rsa';
import * as jwt from 'express-jwt';
import * as express from 'express';
import * as cors from 'cors';

// Auth0 athentication middleware
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${functions.config().auth0.domain}/.well-known/jwks.json`
    }),
    audience: functions.config().auth0.audience,
    issuer: `https://${functions.config().auth0.domain}/`,
    algorithm: 'RS256'
});

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// GET object containing Firebase custom token
app.get('*', jwtCheck, (req, res) => {
    
    // Create UID from authenticated Auth0 user
    const uid = req.user.sub;
    // Mint token using Firebase Admin SDK
    firebaseAdmin.auth().createCustomToken(uid)
        .then(customToken =>
            // Response must be an object or Firebase errors
            res.json({ firebaseToken: customToken })
        )
        .catch(err =>
            res.status(500).send({
                message: 'Something went wrong acquiring a Firebase token.',
                error: err
            })
        );
});

export const createCustomToken = functions.https.onRequest(app);