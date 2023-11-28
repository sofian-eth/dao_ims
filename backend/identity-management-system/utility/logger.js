const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD'
  });

const logger = createLogger({
  
    level: 'debug',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.colorize(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(
            info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
    ),
    transports: [dailyRotateFileTransport]
    
});


module.exports = logger;