import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp(functions.config().firebase);

const db = firebaseAdmin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(async (request, response) => {
    const date: Date = new Date();
    const userRef = db.collection(request.body.team_id).doc(request.body.user_id);
    switch (request.body.command) {
        case '/report':
            return response.send(`https://easyworkhours.web.app/q=${btoa(`${request.body.team_id}:${request.body.user_id}`)}`);
        case '/hi':
            await userRef.set({ 'name': request.body.user_name });
            await userRef.collection('data').add({ command: request.body.command, date: date.getTime() });
            return response.json({
                "response_type": "in_channel",
                "text": `${request.body.user_name} signed in`,
            });
        case '/bye':
            await userRef.set({ 'name': request.body.user_name });
            await userRef.collection('data').add({ command: request.body.command, date: date.getTime() });
            return response.json({
                "response_type": "in_channel",
                "text": `${request.body.user_name} signed out`,
            });
    }
    return;
});


function btoa(string: string): string {
    return Buffer.from(string).toString('base64');
}