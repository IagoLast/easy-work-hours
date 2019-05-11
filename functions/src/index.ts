import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp(functions.config().firebase);

const db = firebaseAdmin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(async (request, response) => {
    const date: Date = new Date();
    const userRef = db.collection(request.body.team_id).doc(request.body.user_id);
    const payload = {command: request.body.command, date: date.getTime()};
    await userRef.set({'name': request.body.user_name});
    await userRef.collection('data').add(payload);
    response.send(JSON.stringify(payload, null, '\t'));
});
