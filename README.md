# Dental App 

This is a demo app I created for dental staffing that connects dental professionals with open shifts and also assists clinics when creating shifts and choosing professionals. Built with React Native and MongoDB. The app uses geospatial search, AI-powered matching, and Google Cloud integrations to streamline the process of finding and filling shifts.

## Features

- **Location-Based Shift Search** — Google Places API-backed autocomplete lets users search by location, proxied through Express to keep API keys secure on the server side.
- **Geospatial Shift Queries** — Shifts are queried by proximity using MongoDB's `$near` operator, returning results ranked by distance from the user.
- **AI-Powered Matching** — Google Gemini compares candidates against newly created shifts and generates a recommendation of candidates based on those who are in the area and their skills.
- **Profile Image Uploads** — Profile photos are uploaded and stored via Google Cloud Storage.
- **Shift Application & Acceptance Flow** — Candidates can apply to shifts, and status updates are tracked in MongoDB throughout the application lifecycle.
- **Calendar Integration** — When an user presses apply to shift, an event is automatically created in the user's Google Calendar via the Google Calendar API (OAuth 2.0 with refresh token support).
   - **This is for demo purposes so realistically once the clinic accepts a professional then the calendar event should be created.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Cloud / APIs | Google Gemini API, Google Cloud Platform, Google Places API, Google Cloud Storage, Google Calendar API, Google Gemini |
| AI help | Claude, Github Copilot, Gemini|

## Architecture Notes

- The Express backend proxies all Google Places API requests so client-side code never has direct access to API keys.
- MongoDB geospatial indexes power efficient `$near` queries for location-based shift discovery.
- Google Calendar events are created server-side using OAuth 2.0 with refresh tokens, so calendar sync happens automatically without requiring the user to re-authenticate each session.

## Getting Started

### Prerequisites

- Node.js v20 LTS
- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud project with Places API, Cloud Storage, and Calendar API enabled
- API credentials for the LLM provider used for matching

### Installation

```bash
# Clone the repository
git clone https://github.com/tiffany707/DentistryApp.git
cd my-app

# Install backend dependencies
cd services
npm install

# Install frontend dependencies
cd ..
npm install
```

### Environment Variables

Create a `.env` file in the services(backend) directory with:

```
MONGODB_CONNECTION_STRING=<your-mongodb-connection-string>
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
GEMINI_API_KEY=<your-google-gemini-api-key>
GOOGLE_CLIENT_ID=<your-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-oauth-client-secret>
GOOGLE_REFRESH_TOKEN=<your-refresh-token>
```

### Running the App

- You have to change the API_URL to your own IP address.

```bash
# Start the backend server
cd services
npm start

# In a separate terminal, start the React Native app
cd ..
npm start
```
## Disclaimer
   The app is based on and works with JP time.
## License

MIT
