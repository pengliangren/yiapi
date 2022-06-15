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
            summary: `更新轮播图`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: schemaConfig.id,
                    thumbnail: schemaConfig.image,
                    recommend_state: tableData.recommend_state.schema
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
                    title: req.body.title,
                    thumbnail: req.body.thumbnail,
                    recommend_state: req.body.recommend_state,
                    updated_at: utils.getDatetime()
                };

                let result = await model.update(utils.clearEmptyData(data));
                return constantConfig.code.SUCCESS_UPDATE;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_UPDATE;
            }
        }
    });
}
