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
                    id: schema.id,
                    thumbnail: schema.image,
                    recommend_state: bannerTable.recommend_state.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('banner')
                .where({ id: req.body.id })
                .modify(function (queryBuilder) {});

            // 需要更新的数据
            let updateData = fn_clearEmptyData({
                title: req.body.title,
                thumbnail: req.body.thumbnail,
                recommend_state: req.body.recommend_state,
                updated_at: fn_getDatetime()
            });

            let result = await model.update(updateData);
            if (!result) {
                return constant.code.FAIL_UPDATE;
            }
            return constant.code.SUCCESS_UPDATE;
        }
    });
}
