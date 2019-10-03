import { LoggerOptions, transports, createLogger, format } from 'winston';

const { printf, timestamp, combine } = format;

const formatDefault = [
    timestamp({
        format: 'DD-MM-YYYY HH:mm:ss A ZZ'
    }),
    printf(info => `\n "Time":"${info.timestamp}", "Level":${info.level}, "Message":${info.message}`)
];

const formatWithStack = [
    timestamp({
        format: 'DD-MM-YYYY HH:mm:ss A ZZ'
    }),
    printf(info => `\n "Time":"${info.timestamp}", "Level":${info.level}, "Message":${info.message} ${info.stack}`)
];

const options: LoggerOptions = {
    level: 'info',
    transports: [
        new transports.File({
            filename: '_logs/combined.log',
            format: combine(
                ...formatDefault
            )
        }),
        new transports.File({
            filename: '_logs/error-simple.log',
            format: combine(
                ...formatDefault
            )
        }),
        new transports.File({
            filename: '_logs/error-full.log',
            format: combine(
                ...formatWithStack
            )
        }),
    ]
};

export const logger = createLogger(options);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new transports.Console({
//         format: format.simple()
//     }));
// }
// 