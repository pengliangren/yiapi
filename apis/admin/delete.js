import { fn_getFileInfos } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import adminTable from '../../tables/admin.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: adminTable.id.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('user')
                .where({ id: req.body.id })
                .modify(function (queryBuilder) {});

            let result = await model.delete();
            if (!result) {
                return constant.code.FAIL_INSERT;
            }
            return constant.code.SUCCESS_INSERT;
        }
    });
}
