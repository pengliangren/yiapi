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
            summary: `添加通知`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    title: tableData.title.schema,
                    summary: tableData.summary.schema,
                    recommend_state: tableData.recommend_state.schema,
                    content: tableData.content.schema
                },
                required: ['title']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    summary: req.body.summary,
                    content: req.body.content,
                    recommend_state: req.body.recommend_state,
                    created_at: utils.getDatetime(),
                    updated_at: utils.getDatetime()
                };

                let result = await model.insert(utils.clearEmptyData(data));
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
