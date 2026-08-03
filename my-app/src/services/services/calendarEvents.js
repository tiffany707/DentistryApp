const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function createShiftEvent(shift) {
  const event = {
    summary: shift.title,
    location: shift.clinicName,
    description: shift.jobDescription,
    start: { dateTime: new Date(shift.startTime).toISOString(), timeZone: shift.timeZone || 'America/Edmonton' },
    end: { dateTime: new Date(shift.endTime).toISOString(), timeZone: shift.timeZone || 'America/Edmonton' },
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return res.data;
}

module.exports = { createShiftEvent };