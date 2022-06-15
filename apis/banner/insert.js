import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/banner.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            tags: [apiInfo.parentDirname],
            summary: `添加轮播图`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    title: tableData.title.schema,
                    thumbnail: tableData.thumbnail.schema,
                    recommend_state: tableData.recommend_state.schema
                },
                required: ['title', 'thumbnail']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    thumbnail: req.body.thumbnail,
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
