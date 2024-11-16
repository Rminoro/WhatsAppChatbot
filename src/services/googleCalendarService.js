// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');

// const credentialsPath = path.join(__dirname, 'credentials.json');
// const credentials = JSON.parse(fs.readFileSync(credentialsPath));

// const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

// const authorize = async () => {
//     const { client_secret, client_id, redirect_uris } = credentials.installed;
//     const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     const tokenPath = path.join(__dirname, 'token.json');
//     if (fs.existsSync(tokenPath)) {
//         const token = JSON.parse(fs.readFileSync(tokenPath));
//         auth.setCredentials(token);
//     } else {
//         throw new Error('Token de autenticação não encontrado. Realize a autenticação inicial.');
//     }

//     return auth;
// };

// const createGoogleCalendarEvent = async (auth, { summary, description, startDateTime, endDateTime }) => {
//     const calendar = google.calendar({ version: 'v3', auth });

//     const event = {
//         summary,
//         description,
//         start: {
//             dateTime: startDateTime,
//             timeZone: 'America/Sao_Paulo',
//         },
//         end: {
//             dateTime: endDateTime,
//             timeZone: 'America/Sao_Paulo',
//         },
//     };

//     const response = await calendar.events.insert({
//         calendarId: 'primary',
//         resource: event,
//     });

//     console.log('Evento criado com sucesso:', response.data.htmlLink);
//     return response.data;
// };
