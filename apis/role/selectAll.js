import { fn_getFileInfos, fn_existsRole } from '../../utils/index.js';
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
                properties: {}
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

                let resultRows = await roleModel.clone().select();
                return {
                    ...constant.code.SUCCESS_SELECT,
                    data: {
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
