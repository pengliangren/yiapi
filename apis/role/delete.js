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
            summary: `删除角色`,
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
                    .modify(function (queryBuilder) {});

                let selectResult = await model.clone().where('pid', req.body.id).first();
                if (selectResult !== undefined) {
                    return _.merge(constantConfig.code.FAIL, { msg: '该权限存在下级权限，无法删除' });
                }

                let result = await model.clone().where({ id: req.body.id }).delete();

                await fastify.cacheRoleData();

                return {
                    ...constantConfig.code.SUCCESS_DELETE,
                    data: result
                };
            } catch (err) {
                return constantConfig.code.FAIL_DELETE;
            }
        }
    });
}
