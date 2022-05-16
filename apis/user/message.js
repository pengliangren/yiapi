import { fn_getFileInfos, fn_getOffset } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import userTable from '../../tables/user.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'GET',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            query: {
                type: 'object',
                properties: {
                    page: schema.page,
                    limit: schema.limit,
                    merchant_id: userTable.id.schema
                }
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('message')
                .where({ 'message.user_id': req.user.id })
                .leftJoin('user', 'message.user_id', 'user.id')
                .modify(function (queryBuilder) {
                    if (req.query.merchant_id !== undefined) {
                        queryBuilder.where('message.merchant_id', req.query.merchant_id);
                    }
                });

            let resultCount = await model.clone().count('', { as: 'count' }).first();
            let resultRows = await model.clone().offset(fn_getOffset(req.query.page, req.query.limit)).limit(req.query.limit).select(
                //
                //
                'message.*',
                'user.nickname',
                'user.phone',
                'user.merchant_name',
                'user.merchant_code'
            );
            return {
                ...constant.code.SUCCESS_SELECT,
                data: {
                    count: resultCount.count,
                    rows: resultRows,
                    page: req.query.page,
                    limit: req.query.limit
                }
            };
        }
    });
}
