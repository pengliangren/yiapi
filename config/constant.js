import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'constant.js'));
let importConfig = await utils.importNew(apiRelativePath, {});

const constantConfig = _.merge(
    {
        code: {
            SUCCESS: { symbol: 'SUCCESS', code: 0, msg: '操作成功' },
            SUCCESS_INSERT: { symbol: 'SUCCESS_INSERT', code: 0, msg: '添加成功' },
            SUCCESS_SELECT: { symbol: 'SUCCESS_SELECT', code: 0, msg: '查询成功' },
            SUCCESS_UPDATE: { symbol: 'SUCCESS_UPDATE', code: 0, msg: '更新成功' },
            SUCCESS_DELETE: { symbol: 'SUCCESS_DELETE', code: 0, msg: '删除成功' },
            FAIL: { symbol: 'FAIL', code: 1, msg: '操作失败' },
            FAIL_INSERT: { symbol: 'FAIL_INSERT', code: 1, msg: '添加失败' },
            FAIL_SELECT: { symbol: 'FAIL_SELECT', code: 1, msg: '查询失败' },
            FAIL_UPDATE: { symbol: 'FAIL_UPDATE', code: 1, msg: '更新失败' },
            FAIL_DELETE: { symbol: 'FAIL_DELETE', code: 1, msg: '删除失败' },
            INFO: { symbol: 'INFO', code: 11, msg: '信息提示' },
            WARN: { symbol: 'WARN', code: 12, msg: '警告提示' },
            ERROR: { symbol: 'ERROR', code: 13, msg: '错误提示' },
            NOT_LOGIN: { symbol: 'NOT_LOGIN', code: 14, msg: '请登录后操作' }
        }
    },
    importConfig.constantConfig
);

export { constantConfig };
