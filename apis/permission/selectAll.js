import { fn_getFileInfos } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import permissionTable from '../../tables/permission.js';

const fileInfos = fn_getFileInfos(import.meta.url);
export default async function (fastify, opts) {
    fastify.route({
        method: 'GET',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            query: {
                type: 'object',
                properties: {
                    tag: permissionTable.tag.schema
                }
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let permissionModel = fastify.mysql //
                    .table('permission')

                    .modify(function (queryBuilder) {
                        if (req.query.tag !== undefined) {
                            queryBuilder.where('tag', req.query.tag);
                        }
                    });

                let resultCount = await permissionModel.clone().count('id', { as: 'count' }).first();
                let resultRows = await permissionModel.clone().orderBy('sort', 'asc').select();
                return {
                    ...constant.code.SUCCESS_SELECT,
                    data: {
                        count: resultCount.count,
                        rows: resultRows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_SELECT;
            }
        }
    });
}
