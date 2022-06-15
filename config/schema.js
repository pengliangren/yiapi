import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'schema.js'));
let importConfig = await utils.importNew(apiRelativePath, {});

const schemaConfig = _.merge(
    {
        // 当前第几页
        id: {
            type: 'integer',
            minimum: 1,
            title: '主键ID'
        },
        // 当前第几页
        page: {
            type: 'integer',
            minimum: 1,
            default: 1,
            title: '第几页'
        },
        // 每页数量
        limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20,
            title: '每页数量'
        },
        // 布尔数字
        boolNumber: {
            type: 'integer',
            enum: [0, 1],
            title: '布尔值'
        },
        // 数据状态
        state: {
            type: 'integer',
            enum: [0, 1, 2],
            title: '状态(0正常,1禁用,2删除)'
        },
        // 搜索关键字
        keywords: {
            type: 'string',
            minLength: 0,
            maxLength: 100,
            title: '搜索关键字'
        },
        // 单个图片类型的字段
        image: {
            type: 'string',
            minLength: 0,
            maxLength: 200
        }
    },
    importConfig.schemaConfig
);

export { schemaConfig };
