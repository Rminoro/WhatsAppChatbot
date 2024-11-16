const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../credentials/token.json');

const authorize = async () => {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_id, client_secret, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);

            oAuth2Client.setCredentials(token);
            // Salvar o token para uso futuro
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token saved to', TOKEN_PATH);
        });
    });
};

authorize();
