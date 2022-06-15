import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'app.js'));
let importConfig = await utils.importNew(apiRelativePath, {});

const appConfig = _.merge(
    {
        // 应用名称
        appName: '易接口',
        appNameEn: 'yiapi',
        // 加密盐
        salt: 'yiapi-123456.',
        // 过期时间
        expires: '3d',
        // 接口前缀
        apiPrefix: 'https://yiapi.chensuiyi.com',
        // 监听端口
        port: 3000,
        // 监听主机
        host: '127.0.0.1',
        // 默认开发管理员密码
        devPassword: 'dev123456!@#',
        // 接口超时 3 分钟
        apiTimeout: 3 * 60 * 1000,
        // 不需要鉴权的接口
        whiteLists: [
            //
            '/',
            '/docs/**',
            '/tool/**',
            '/admin/login',
            '/user/login',
            '/user/register'
        ],
        loggerLabel: {
            10: 'trace',
            20: 'debug',
            30: 'info',
            40: 'warn',
            50: 'error',
            60: 'fatal'
        }
    },
    importConfig.appConfig
);

export { appConfig };
