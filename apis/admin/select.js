import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/admin.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            tags: [apiInfo.parentDirname],
            summary: `查询管理员`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    page: schemaConfig.page,
                    limit: schemaConfig.limit
                }
            }
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {
                        if (utils.existsRole(req.user, 'dev') === false) {
                            queryBuilder.where('account', '<>', 'dev');
                        }
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
                        }
                    });

                let resultCount = await model.clone().count('id', { as: 'count' }).first();
                let rows = await model
                    //
                    .clone()
                    .offset(utils.getOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                return {
                    ...constantConfig.code.SUCCESS_SELECT,
                    data: {
                        count: resultCount.count,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_SELECT;
            }
        }
    });
}
