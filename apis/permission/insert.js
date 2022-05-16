import { merge as _merge } from 'lodash-es';
import { fn_getFileInfos, fn_clearEmptyData, fn_getDatetime } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import permissionTable from '../../tables/permission.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    pid: permissionTable.pid.schema,
                    name: permissionTable.name.schema,
                    value: permissionTable.value.schema,
                    icon: permissionTable.icon.schema,
                    sort: permissionTable.sort.schema,
                    describe: permissionTable.describe.schema,
                    is_open: permissionTable.is_open.schema,
                    tag: permissionTable.tag.schema
                },
                required: ['pid', 'name', 'tag']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let permissionModel = fastify.mysql //
                    .table('permission')
                    .modify(function (queryBuilder) {});
                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    let parentPermission = await permissionModel.clone().where('id', req.body.pid).first();
                    if (parentPermission === undefined) {
                        return _merge(constant.code.FAIL, { msg: '父级权限不存在' });
                    }
                    req.body.pids = `${parentPermission.pids},${parentPermission.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                let insertData = fn_clearEmptyData({
                    pid: req.body.pid,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    describe: req.body.describe,
                    tag: req.body.tag,
                    pids: req.body.pids,
                    level: req.body.level,
                    created_at: fn_getDatetime(),
                    updated_at: fn_getDatetime()
                });
                let result = await permissionModel.clone().insert(insertData);

                await fastify.cachePermissionData();
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
