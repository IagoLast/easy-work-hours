import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import trackFn from './track/track';
import oauthFn from './oauth/oauth';

firebaseAdmin.initializeApp(functions.config().firebase);
const DB = firebaseAdmin.firestore();


export const track = functions.https.onRequest((req, res) => trackFn(DB, req, res));
export const oauth = functions.https.onRequest(oauthFn);
