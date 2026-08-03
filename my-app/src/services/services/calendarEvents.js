const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

function mergeDateAndTime(dateVal, timeVal) {
  const merged = new Date(dateVal);
  const time = new Date(timeVal);
  merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return merged;
}

async function createShiftEvent(shift) {
  const start = mergeDateAndTime(shift.date, shift.startTime);
  const end = mergeDateAndTime(shift.date, shift.endTime);

  const event = {
    summary: shift.title,
    location: shift.clinicName,
    description: shift.jobDescription,
    start: { dateTime: start.toISOString(), timeZone: shift.timeZone || 'America/Edmonton' },
    end: { dateTime: end.toISOString(), timeZone: shift.timeZone || 'America/Edmonton' },
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    // sendUpdates: 'all', // emails the invite to attendees
  });

  return res.data;
}

module.exports = { createShiftEvent };