import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'cors.js'));
let _corsConfig = await utils.importNew(apiRelativePath, {});

const corsConfig = _.merge(
    {
        methods: ['GET', 'OPTIONS', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'token'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization', 'authorization', 'token'],
        preflightContinue: false,
        strictPreflight: false,
        preflight: true,
        optionsSuccessStatus: 204,
        credentials: false
    },
    _corsConfig
);

export { corsConfig };
