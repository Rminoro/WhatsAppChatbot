const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const createGoogleCalendarEvent = async (auth, { summary, description, startDateTime, endDateTime }) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
        summary,
        description,
        start: {
            dateTime: startDateTime,
            timeZone: 'America/Sao_Paulo',
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'America/Sao_Paulo',
        },
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });

    console.log('Evento criado com sucesso:', response.data.htmlLink);
    return response.data;
};

module.exports = { createGoogleCalendarEvent };
