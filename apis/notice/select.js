import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/notice.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `查询通知`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
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
                    .modify(function (queryBuilder) {
                        if (req.body.keywords) {
                            queryBuilder.where('title', 'like', `%${req.body.keywords}%`);
                        }
                    });

                let resultCount = await model //
                    .clone()
                    .count('id', { as: 'count' })
                    .first();

                let rows = await model //
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
