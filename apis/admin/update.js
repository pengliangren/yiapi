import { fn_getFileInfos, fn_clearEmptyData, fn_MD5, fn_getDatetime } from '../../utils/index.js';
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
                    id: adminTable.id.schema,
                    password: adminTable.password.schema,
                    nickname: adminTable.nickname.schema,
                    role_codes: adminTable.role_codes.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('admin')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let updateData = fn_clearEmptyData({
                    password: fn_MD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes,
                    updated_at: fn_getDatetime()
                });

                let updateResult = await roleModel.update(updateData);

                return constant.code.SUCCESS_UPDATE;
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_UPDATE;
            }
        }
    });
}
