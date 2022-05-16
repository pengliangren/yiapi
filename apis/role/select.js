import { fn_getFileInfos, fn_getOffset, fn_existsRole } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';

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
                    limit: schema.limit
                }
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('role')
                    .modify(function (queryBuilder) {
                        if (fn_existsRole(req.user, 'dev') === false) {
                            queryBuilder.where('code', '<>', 'dev');
                        }
                    });

                let resultCount = await roleModel.clone().count('id', { as: 'count' }).first();
                let resultRows = await roleModel
                    .clone()
                    //
                    .offset(fn_getOffset(req.query.page, req.query.limit))
                    .limit(req.query.limit)
                    .select();
                return {
                    ...constant.code.SUCCESS_SELECT,
                    data: {
                        count: resultCount.count,
                        rows: resultRows,
                        page: req.query.page,
                        limit: req.query.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_SELECT;
            }
        }
    });
}
