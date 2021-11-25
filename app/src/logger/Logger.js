const winston = require( "winston" );

const logger = winston.createLogger( {
    level: "info",
    format: winston.format.combine(
        winston.format.splat(),
        // Format time
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),

        winston.format.colorize(),
        // Format log
        winston.format.printf(
            log => {
                // Display stack trace for error log
                if(log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                return  `[${log.timestamp}] [${log.level}] ${log.message}`;
            },
        ),
    ),
    transports: [
        // - Write all logs error to `error.log`.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console()
    ]
} );

module.exports = logger;