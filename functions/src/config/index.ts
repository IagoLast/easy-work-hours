import * as functions from 'firebase-functions';

export default {
    SLACK_CLIENT_ID: functions.config().slack.client_id,
    SLACK_CLIENT_SECRET: functions.config().slack.client_secret,
};