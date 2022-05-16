import { merge as _merge } from 'lodash-es';
import { fn_getFileInfos } from '../../utils/index.js';
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
                    id: permissionTable.id.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let permissionModel = fastify.mysql.table('permission');

                let selectResult = await permissionModel.clone().where('pid', req.body.id).first();
                if (selectResult !== undefined) {
                    return _merge(constant.code.FAIL, { msg: '该权限存在下级权限，无法删除' });
                }

                let deleteResult = await permissionModel.clone().where({ id: req.body.id }).delete();

                await fastify.cachePermissionData();
                return constant.code.SUCCESS_DELETE;
            } catch (err) {
                return constant.code.FAIL_DELETE;
            }
        }
    });
}
