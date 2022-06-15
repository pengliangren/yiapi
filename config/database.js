import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'database.js'));
let importConfig = await utils.importNew(apiRelativePath, {});

const databaseConfig = _.merge(
    {
        db: '',
        username: '',
        password: '',
        host: '',
        dialect: 'mysql',
        port: 3306
    },
    importConfig.databaseConfig
);

export { databaseConfig };
