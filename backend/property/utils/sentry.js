const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const dotenv = require('dotenv');
dotenv.config();

Sentry.init({
    dsn: process.env.sentryUrl,
    tracesSampleRate: 1.0,
  });
  

module.exports = Sentry;

  