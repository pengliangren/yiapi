// 初始化接口分类
import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'api.js'));
let importConfig = await utils.importNew(apiRelativePath, []);

const apiConfig = _.concat(
    [
        {
            name: '目录',
            value: '/tree'
        },
        {
            name: '角色',
            value: '/role'
        },
        {
            name: '管理员',
            value: '/admin'
        },
        {
            name: '轮播',
            value: '/banner'
        },
        {
            name: '反馈',
            value: '/feedback'
        },
        {
            name: '通知',
            value: '/notice'
        },
        {
            name: '字典',
            value: '/dictionary'
        }
    ],
    importConfig.apiConfig
);

export { apiConfig };
