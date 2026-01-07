
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// Initialize Sentry for error monitoring
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn && sentryDsn !== 'https://your-sentry-dsn@sentry.io/project-id') {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
