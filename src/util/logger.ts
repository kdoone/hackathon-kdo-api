import { LoggerOptions, transports, createLogger, format } from 'winston';
const { printf, timestamp, combine } = format;

// Форматы
const defaultTimestamp = timestamp({ format: 'DD-MM-YYYY HH:mm:ss A ZZ' });

const formatDefault = [
    defaultTimestamp,
    printf(info => `\n "Time":"${info.timestamp}", "Level":${info.level}, "Message":${info.message}`)
];

const formatWithStack = [
    defaultTimestamp,
    printf(info => `\n "Time":"${info.timestamp}", "Level":${info.level}, "Message":${info.message} ${info.stack}`)
];

// Создание транспорта для записи логов в файлы
interface CreateTransportsFile {
    (filename: string, format: any): any;
}

const createTransportsFile: CreateTransportsFile = (filename, format) => {
    return new transports.File({
        filename,
        format
    });
};

const options: LoggerOptions = {
    level: 'info',
    transports: [
        createTransportsFile('_logs/combined.log', combine(...formatDefault)),
        createTransportsFile('_logs/error-simple.log', combine(...formatDefault)),
        createTransportsFile('_logs/error-full.log', combine(...formatWithStack))
    ]
};

export const logger = createLogger(options);

// Если работаем в деве то выводить в консоль
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(...formatDefault)
    }));
}
