import pino from 'pino'
import dayjs from 'dayjs'
import fs from 'fs-extra'
const filename = dayjs().format('YYYY-MM-DD');
const fatalFile = `logs/fatal/${filename}.log`;
const errorFile = `logs/error/${filename}.log`;
const warnFile = `logs/warn/${filename}.log`;
const infoFile = `logs/info/${filename}.log`;
const debugFile = `logs/debug/${filename}.log`;
fs.ensureFileSync(fatalFile);
fs.ensureFileSync(errorFile);
fs.ensureFileSync(warnFile);
fs.ensureFileSync(infoFile);
fs.ensureFileSync(debugFile);
let targets = [
    { target: 'pino/file', level: 'fatal', options: { destination: fatalFile } },
    { target: 'pino/file', level: 'error', options: { destination: errorFile } },
    { target: 'pino/file', level: 'warn', options: { destination: warnFile } },
    { target: 'pino/file', level: 'info', options: { destination: infoFile } },
    { target: 'pino/file', level: 'debug', options: { destination: debugFile } }
];
// targets.push({ target: 'pino-pretty', options: { destination: 1, translateTime: 'SYS:standard', colorize: true } });
if (process.env.NODE_ENV === 'development') {
    targets.push({ target: 'pino-pretty', options: { destination: 1, translateTime: 'SYS:standard', colorize: true } });
}
const transport = pino.transport({
    targets: targets
});
let logger = pino(
    {
        name: 'find-goods',
        crlf: true,
        timestamp: () => `,"time":"${dayjs().format()}"`
    },
    transport
);

process.on('uncaughtExceptionMonitor', (error, origin) => {
    logger.fatal(error);
    process.exit();
});

// process.on(
//     'uncaughtException',
//     pino.final(logger, (err, finalLogger) => {
//         finalLogger.error(err, 'uncaughtException');
//         process.exit(1);
//     })
// );

// process.on(
//     'unhandledRejection',
//     pino.final(logger, (err, finalLogger) => {
//         finalLogger.error(err, 'unhandledRejection');
//         // process.exit(1);
//     })
// );
export default  logger;
