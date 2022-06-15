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
            summary: `删除树`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema
                },
                required: ['id']
            }
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql.table(tableName);

                let selectResult = await model.clone().where({ pid: req.body.id }).first();
                if (selectResult) {
                    return { ...constantConfig.code.FAIL, msg: '该树存在下级树，无法删除' };
                }

                let result = await model.clone().where({ id: req.body.id }).delete();

                await fastify.cacheTreeData();

                return {
                    ...constantConfig.code.SUCCESS_DELETE,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_DELETE;
            }
        }
    });
}
