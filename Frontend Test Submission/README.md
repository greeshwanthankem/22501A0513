# URL Shortener Frontend

A React-based URL shortener application with Material-UI design and comprehensive logging.

## Features

- **Multi-URL Shortening**: Create up to 5 short URLs simultaneously
- **Custom Shortcodes**: Optional user-defined shortcodes (3-20 alphanumeric chars)
- **Validity Control**: Set custom expiry times (default: 30 minutes)
- **Click Analytics**: Track clicks with timestamps, sources, and locations
- **Client-side Routing**: Handle redirects directly in the React app
- **Material-UI Design**: Clean, modern, responsive interface

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── Navigation/
│   ├── UrlShortener/
│   └── Statistics/
├── pages/
├── utils/
└── App.js
```

## Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## API Integration

The app expects a backend API running on `http://localhost:5000` with endpoints:
- `POST /api/shorten` - Create short URLs
- `GET /api/statistics` - Get URL statistics
- `POST /api/redirect/:shortcode` - Handle redirects

## Logging

This application uses a custom logging middleware that sends logs to an external evaluation service. All user interactions and API calls are logged for monitoring purposes.
