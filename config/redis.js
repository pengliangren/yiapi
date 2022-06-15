import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'redis.js'));
let _redisConfig = await utils.importNew(apiRelativePath, {});

const redisConfig = _.merge(
    {
        host: '127.0.0.1',
        port: 6379,
        username: null,
        password: '',
        keyPrefix: 'yiapi#'
    },
    _redisConfig
);

export { redisConfig };
