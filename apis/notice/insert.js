import { fn_getFileInfos, fn_clearEmptyData, fn_getDatetime } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import noticeTable from '../../tables/notice.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    title: noticeTable.title.schema,
                    summary: noticeTable.summary.schema,
                    recommend_state: noticeTable.recommend_state.schema,
                    content: noticeTable.content.schema
                },
                required: ['title']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('notice')
                .modify(function (queryBuilder) {});

            let insertData = fn_clearEmptyData({
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
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
