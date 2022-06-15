import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'role.js'));
let _roleConfig = await utils.importNew(apiRelativePath, []);

// 角色初始化配置
const roleConfig = _.concat(
    [
        {
            code: 'visitor',
            name: '游客',
            describe: '具备有限的权限和有限的查看内容'
        },
        {
            code: 'user',
            name: '用户',
            describe: '用户权限和对于的内容查看'
        },
        {
            code: 'admin',
            name: '管理',
            describe: '管理权限、除开发相关权限之外的权限等'
        },
        {
            code: 'super',
            name: '超级管理',
            describe: '超级管理权限、除开发相关权限之外的权限等'
        }
    ],
    _roleConfig
);

export { roleConfig };
