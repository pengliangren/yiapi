import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/role.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新角色`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema,
                    name: tableData.name.schema,
                    describe: tableData.describe.schema,
                    menu_ids: tableData.menu_ids.schema,
                    api_ids: tableData.api_ids.schema
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

                // 需要更新的数据
                let data = {
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids,
                    api_ids: req.body.api_ids,
                    updated_at: utils.getDatetime()
                };

                let result = await model.update(utils.clearEmptyData(data));

                await fastify.cacheRoleData();

                return {
                    ...constantConfig.code.SUCCESS_UPDATE,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_UPDATE;
            }
        }
    });
}
