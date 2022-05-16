import { fn_getFileInfos } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import userTable from '../../tables/user.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'GET',
        url: `/${fileInfos.pureFileName}`,
        schema: {},
        config: {},
        handler: async function (req, res) {
            try {
                // 查询用户是否存在
                let model = fastify.mysql.table('user').where({
                    id: req.user.id
                });
                let result = await model.first();
                return {
                    ...constant.code.SUCCESS_SELECT,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_SELECT;
            }
        }
    });
}
