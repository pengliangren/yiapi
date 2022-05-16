import { merge as _merge } from 'lodash-es';
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
                    code: roleTable.code.schema,
                    name: roleTable.name.schema,
                    describe: roleTable.describe.schema,
                    menu_ids: roleTable.menu_ids.schema
                },
                required: ['name', 'code']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let roleTable = fastify.mysql //
                    .table('role')
                    .modify(function (queryBuilder) {});
                let _result = await roleTable.clone().where('name', req.body.name).first();
                if (_result !== undefined) {
                    return _merge(constant.code.FAIL, { msg: '角色已存在' });
                }

                let insertData = fn_clearEmptyData({
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids,
                    created_at: fn_getDatetime(),
                    updated_at: fn_getDatetime()
                });
                let result = await roleTable.clone().insert(insertData);

                await fastify.cacheRoleData();
                return {
                    ...constant.code.SUCCESS_INSERT,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL_INSERT;
            }
        }
    });
}
