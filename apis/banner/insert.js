import { fn_getFileInfos, fn_clearEmptyData, fn_getDatetime } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import bannerTable from '../../tables/banner.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    title: bannerTable.title.schema,
                    thumbnail: bannerTable.thumbnail.schema,
                    recommend_state: bannerTable.recommend_state.schema
                },
                required: ['title', 'thumbnail']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('banner')
                .modify(function (queryBuilder) {});

            let insertData = fn_clearEmptyData({
                title: req.body.title,
                thumbnail: req.body.thumbnail,
                recommend_state: req.body.recommend_state,
                created_at: fn_getDatetime(),
                updated_at: fn_getDatetime()
            });
            let result = await model.insert(insertData);
            if (!result) {
                return constant.code.FAIL_INSERT;
            }
            return {
                ...constant.code.SUCCESS_INSERT,
                data: result
            };
        }
    });
}
