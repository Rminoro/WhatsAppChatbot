const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const credentialsPath = path.join(__dirname, '../../credentials/credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

// Função para autorizar e obter o client de autenticação
const authorize = async () => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const tokenPath = path.join(__dirname, 'token.json');
    if (fs.existsSync(tokenPath)) {
        const token = JSON.parse(fs.readFileSync(tokenPath));
        auth.setCredentials(token);
    } else {
        throw new Error('Token de autenticação não encontrado. Realize a autenticação inicial.');
    }

    return auth;
};

module.exports = { authorize };
