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
            summary: `查询字典`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    pid: tableData.pid.schema,
                    page: schemaConfig.page,
                    limit: schemaConfig.limit,
                    keywords: schemaConfig.keywords
                }
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .where('pid', req.body.pid)
                    .modify(function (queryBuilder) {
                        if (req.body.keywords) {
                            queryBuilder.where('name', 'like', `%${req.body.keywords}%`);
                        }
                    });

                let resultCount = await model
                    //
                    .clone()
                    .count('id', { as: 'count' })
                    .first();
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
                        rows: rows.map((item) => {
                            if (item.type === 'number') {
                                item.value = Number(item.value);
                            }
                            return item;
                        }),
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
