import * as _ from 'lodash-es';
import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/tree.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `添加树`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    pid: tableData.pid.schema,
                    type: tableData.type.schema,
                    name: tableData.name.schema,
                    value: tableData.value.schema,
                    icon: tableData.icon.schema,
                    sort: tableData.sort.schema,
                    describe: tableData.describe.schema,
                    is_bool: tableData.is_bool.schema,
                    is_open: tableData.is_open.schema
                },
                required: ['pid', 'type', 'name']
            }
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});
                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    let parentPermission = await model.clone().where('id', req.body.pid).first();
                    if (!parentPermission) {
                        return { ...constantConfig.code.FAIL, msg: '父级树不存在' };
                    }
                    req.body.pids = `${parentPermission.pids},${parentPermission.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                let data = {
                    pid: req.body.pid,
                    type: req.body.type,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    is_bool: req.body.is_bool,
                    describe: req.body.describe,
                    pids: req.body.pids,
                    level: req.body.level,
                    created_at: utils.getDatetime(),
                    updated_at: utils.getDatetime()
                };
                let result = await model
                    //
                    .clone()
                    .insert(utils.clearEmptyData(data));

                await fastify.cacheTreeData();

                return {
                    ...constantConfig.code.SUCCESS_INSERT,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_INSERT;
            }
        }
    });
}
