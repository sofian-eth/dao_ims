const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
    dsn: "https://d582134400324fefb3896260ea9e6967@o473219.ingest.sentry.io/5566165",
    tracesSampleRate: 1.0,
  });
  

module.exports = Sentry;

  