import { merge as _merge } from 'lodash-es';
import { fn_getFileInfos, fn_getDatetime, fn_clearEmptyData } from '../../utils/index.js';
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
                    id: permissionTable.id.schema,
                    pid: permissionTable.pid.schema,
                    name: permissionTable.name.schema,
                    value: permissionTable.value.schema,
                    icon: permissionTable.icon.schema,
                    sort: permissionTable.sort.schema,
                    is_open: permissionTable.is_open.schema,
                    describe: permissionTable.describe.schema,
                    tag: permissionTable.tag.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            const trxProvider = fastify.mysql.transactionProvider();
            const trx = await trxProvider();
            try {
                let permissionModel = trx.table('permission');

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await permissionModel.clone().where('id', req.body.pid).first();
                    if (parentData === undefined) {
                        return _merge(constant.code.FAIL, { msg: '父级菜单不存在' });
                    }
                }

                let selfData = await permissionModel.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return _merge(constant.code.FAIL, { msg: '菜单不存在' });
                }

                // 需要更新的数据
                let updateData = {
                    name: req.body.name,
                    pid: req.body.pid,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    describe: req.body.describe,
                    tag: req.body.tag,
                    updated_at: fn_getDatetime()
                };

                if (parentData !== undefined) {
                    updateData.pids = [parentData.pids, parentData.id].join(',');
                }
                let updateResult = await permissionModel.clone().where({ id: req.body.id }).update(fn_clearEmptyData(updateData));

                // 如果更新成功，则更新所有子级
                if (updateResult) {
                    let childrenPids = [updateData.pids || selfData.pid, req.body.id];
                    await permissionModel
                        .clone()
                        .where({ pid: req.body.id })
                        .update({
                            pids: childrenPids.join(','),
                            level: childrenPids.length,
                            updated_at: fn_getDatetime()
                        });
                }

                await trx.commit();
                await fastify.cachePermissionData();
                return constant.code.SUCCESS_UPDATE;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return constant.code.FAIL_UPDATE;
            }
        }
    });
}
