import { fn_getFileInfos, fn_clearEmptyData, fn_getDatetime } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import feedbackTable from '../../tables/feedback.js';

const fileInfos = fn_getFileInfos(import.meta.url);
export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    content: feedbackTable.content.schema,
                    merchant_id: feedbackTable.merchant_id.schema,
                    goods_id: feedbackTable.goods_id.schema
                },
                required: ['content']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('feedback')
                .modify(function (queryBuilder) {});

            let insertData = fn_clearEmptyData({
                user_id: req.user.id,
                merchant_id: req.body.merchant_id,
                goods_id: req.body.goods_id,
                content: req.body.content,
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
