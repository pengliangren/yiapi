import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'path';
import pinoPretty from 'pino-pretty';

import { systemConfig } from '../system.js';
import { appConfig } from './app.js';

fs.ensureDir(path.resolve(systemConfig.appDir, 'logs'));

let loggerConfig = {
    level: 'info',
    name: appConfig.appName,
    mixin(_context, level) {
        let reqContext = _context?.res?.request || {};
        let apiContext = _context?.res?.request?.context || {};
        return {
            //
            levelLabel: appConfig.loggerLabel[level] || '',
            apiName: apiContext?.schema?.summary || '',
            apiTags: apiContext?.schema?.tags || '',
            apiDescription: apiContext?.schema?.description || '',
            reqSession: reqContext?.user || '',
            reqBody: reqContext?.body || '',
            reqIp: reqContext?.ip || ''
        };
    },
    timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`,
    file: path.resolve(systemConfig.appDir, 'logs', `${dayjs().format('YYYY-MM-DD')}.log`)
};

if (process.env.NODE_ENV === 'development') {
    loggerConfig = {
        name: appConfig.appName,
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        }
    };
}
export { loggerConfig };
