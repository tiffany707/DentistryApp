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
  location: shift.address,
  description: shift.jobDescription,
  start: {
    // Format your start time string directly in the clinic's local time zone
    // Example using ISO string format with the explicit offset:
    dateTime: '2026-08-22T08:00:00', // or adjust based on your shift data object
    timeZone: 'America/Vancouver',  // <-- THIS IS THE MAGIC FIX
  },
  end: {
    dateTime: '2026-08-22T15:30:00',
    timeZone: 'America/Vancouver',  // <-- Tells Google Calendar which zone the numbers belong to
  },
};

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return res.data;
}

module.exports = { createShiftEvent };