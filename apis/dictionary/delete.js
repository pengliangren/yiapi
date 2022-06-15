import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/dictionary.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `删除字典`,
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
                let model = fastify.mysql //
                    .table(tableName)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let result = await model.delete();
                return constantConfig.code.SUCCESS_DELETE;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_DELETE;
            }
        }
    });
}
