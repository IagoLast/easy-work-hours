import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';

export default async function trackFn(DB: FirebaseFirestore.Firestore, request: functions.https.Request, response: functions.Response) {
    if (request.query.monitor) {
        response.send(200);
        return;
    }
    
    console.info('request:track', request.body);

    const registersRef = DB.collection('registers').doc(request.body.team_id).collection(request.body.user_id);

    switch (request.body.command) {
        case '/report':
            response.send(_buildReportURL(request));
            return;
        case '/hi':
            await _track(DB, registersRef, request);
            response.json({ "response_type": "in_channel", "text": `${request.body.user_name} signed in` });
            return;
        case '/bye':
            await _track(DB, registersRef, request);
            response.json({ "response_type": "in_channel", "text": `${request.body.user_name} signed out` });
            return;
    }
}


async function _track(DB: FirebaseFirestore.Firestore, registers: firebaseAdmin.firestore.CollectionReference, request: functions.https.Request) {
    const date: Date = new Date();
    return Promise.all([
        registers.add({ command: request.body.command, date }),
        DB.collection('meta').doc(request.body.team_id).set({ team: request.body.team_domain })
    ]);
}

function _buildReportURL(request: functions.https.Request) {
    return `https://easyworkhours.web.app?q=${_btoa(`${request.body.team_id}:${request.body.user_id}`)}`
}

function _btoa(string: string): string {
    return Buffer.from(string).toString('base64');
}