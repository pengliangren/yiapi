import { fn_getFileInfos, fn_clearEmptyData } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import userTable from '../../tables/user.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: userTable.id.schema,
                    nickname: userTable.nickname.schema,
                    avatar: userTable.avatar.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql.table('user').modify(function (queryBuilder) {
                // 如果携带ID，且当前登录角色为超级管理员的，则可以修改
                if (req.body.id && req.user.role_code === constant.role.SUPER) {
                    queryBuilder.where({ id: req.body.id });
                } else {
                    // 否则就是修改自己的信息
                    queryBuilder.where({ id: req.user.id });
                }
            });
            // 需要更新的数据
            let updateData = fn_clearEmptyData({
                nickname: req.body.nickname,
                avatar: req.body.avatar
            });

            let result = await model.update(updateData);
            if (!result) {
                return constant.code.FAIL_UPDATE;
            }
            return constant.code.SUCCESS_UPDATE;
        }
    });
}
