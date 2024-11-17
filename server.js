const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { createGoogleCalendarEvent } = require('./src/services/createEvent'); // Importe a função de criação de evento
const { sendToWhatsApp } = require('./src/utils/sendWhatsapp');  // Importe a função sendToWhatsApp
const dotenv = require('dotenv')

const app = express();
const port = 3000;

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials/credentials.json');
const TOKEN_PATH = path.join(__dirname, 'credentials/token.json');

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Rota para iniciar o processo de autorização
app.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// Rota de callback após a autorização do Google
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));  // Salvar o token no arquivo
        console.log('Token saved to', TOKEN_PATH);

        res.send('Authentication successful! You can now create an event.');

    } catch (error) {
        console.error('Error while trying to retrieve access token', error);
        res.send('Error while trying to retrieve access token.');
    }
});

// Rota para criar evento no Google Calendar
app.get('/create-event', async (req, res) => {
    const tokenPath = path.join(__dirname, 'credentials/token.json');
    if (fs.existsSync(tokenPath)) {
        const token = JSON.parse(fs.readFileSync(tokenPath));
        oAuth2Client.setCredentials(token);

        // Criar evento no Google Calendar
        try {
            const eventDetails = {
                summary: 'Team Meeting',
                description: 'Discuss project status and tasks.',
                startDateTime: '2024-12-06T10:00:00-03:00',
                endDateTime: '2024-12-06T11:00:00-03:00',
            };

            const event = await createGoogleCalendarEvent(oAuth2Client, eventDetails);

            // Enviar mensagem pelo WhatsApp
            const message = `Seu evento foi criado com sucesso: ${event.htmlLink}`;
            await sendToWhatsApp('whatsapp:+5511995003578', message);  // Número de destino e a mensagem

            res.send('Evento Criado e mensagem enviada no whatsapp com sucesso!');
        } catch (error) {
            console.error('Error creating event', error);
            res.send('Error creating event.');
        }
    } else {
        res.send('Token não encontrado, favor autenticar primeiro.');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
