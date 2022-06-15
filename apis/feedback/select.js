import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/feedback.js';

const apiInfo = utils.getApiInfo(import.meta.url);
export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新意见反馈`,
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
                    .leftJoin('user', 'feedback.user_id', 'user.id')
                    .modify(function (queryBuilder) {});

                let resultCount = await model.clone().count('*', { as: 'count' }).first();
                let rows = await model //
                    .clone()
                    .offset(utils.getOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select('feedback.*', 'user.nickname', 'user.username', 'user.phone');
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
