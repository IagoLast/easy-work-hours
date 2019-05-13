
import * as functions from 'firebase-functions';
import config from './../config/index';

const REDIRECT_URI = 'https://us-central1-easyworkhours.cloudfunctions.net/oauth';
export default async function oauthFn(request: functions.https.Request, response: functions.Response) {
    if (request.query.code) {
        response.send(`
            <p> loading... </p>
            <script>
                fetch('${_getAuthorizedURL(request.query.code)}', { mode: 'cors'})
                    .then(res => res.json())
                    .then(res => {
                        if(res.ok) {
                            window.location.href = 'https://easyworkhours.web.app/welcome.html'
                        } else {
                            alert(res.error);
                            window.location.href = 'https://easyworkhours.web.app/error.html'
                        }
                    })
            </script>
        `);
        return;
    }
    response.redirect('https://easyworkhours.web.app/error.html')
}

/**
  * Get authorize url for a given code
  * https://api.slack.com/methods/oauth.access
 */
function _getAuthorizedURL(code: string) {
    return `https://slack.com/api/oauth.access?client_id=${config.SLACK_CLIENT_ID}&client_secret=${config.SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`;
}