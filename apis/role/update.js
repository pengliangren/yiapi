import { fn_getFileInfos, fn_clearEmptyData, fn_getDatetime } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import roleTable from '../../tables/role.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: roleTable.id.schema,
                    name: roleTable.name.schema,
                    describe: roleTable.describe.schema,
                    menu_ids: roleTable.menu_ids.schema,
                    api_ids: roleTable.api_ids.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('role')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let updateData = fn_clearEmptyData({
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids,
                    api_ids: req.body.api_ids,
                    updated_at: fn_getDatetime()
                });

                let updateResult = await roleModel.update(updateData);

                await fastify.cacheRoleData();

                return constant.code.SUCCESS_UPDATE;
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_UPDATE;
            }
        }
    });
}
