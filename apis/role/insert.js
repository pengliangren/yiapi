import * as _ from 'lodash-es';
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
            summary: `添加角色`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    code: tableData.code.schema,
                    name: tableData.name.schema,
                    describe: tableData.describe.schema,
                    menu_ids: tableData.menu_ids.schema
                },
                required: ['name', 'code']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});
                let _result = await model.clone().where('name', req.body.name).first();
                if (_result !== undefined) {
                    return _.merge(constantConfig.code.FAIL, { msg: '角色已存在' });
                }

                let data = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids,
                    created_at: utils.getDatetime(),
                    updated_at: utils.getDatetime()
                };
                let result = await model.clone().insert(utils.clearEmptyData(data));

                await fastify.cacheRoleData();

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
