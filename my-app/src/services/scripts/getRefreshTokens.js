// getRefreshToken.js — run this once, locally, not part of your app
const { google } = require('googleapis');
const readline = require('readline');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob' 
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline', // required to get a refresh token, not just an access token
  scope: ['https://www.googleapis.com/auth/calendar.events'],
});

console.log('Visit this URL, authorize, then paste the code below:', authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Enter the code from that page: ', async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('Your refresh token:', tokens.refresh_token); // save this to .env
  rl.close();
});