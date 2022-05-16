import { fn_getFileInfos } from '../../utils/index.js';
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
                const result = await fastify.getUserApis(req.user);
                return {
                    ...constant.code.SUCCESS_SELECT,
                    data: {
                        rows: result
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_SELECT;
            }
        }
    });
}
