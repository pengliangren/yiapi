import { nanoid } from 'nanoid';
import { merge as _merge } from 'lodash-es';
import { fn_getFileInfos, fn_MD5, fn_clearEmptyData, fn_getDatetime } from '../../utils/index.js';
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
                    account: adminTable.account.schema,
                    password: adminTable.password.schema,
                    nickname: adminTable.nickname.schema,
                    role_codes: adminTable.role_codes.schema
                },
                required: ['account', 'password', 'nickname']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql //
                    .table('admin')
                    .modify(function (queryBuilder) {});
                let _result = await adminModel.clone().orWhere('account', req.body.account).orWhere('nickname', req.body.nickname).first();
                if (_result !== undefined) {
                    return _merge(constant.code.FAIL, { msg: '管理员账号或昵称已存在' });
                }

                let insertData = fn_clearEmptyData({
                    account: req.body.account,
                    password: fn_MD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes,
                    uuid: nanoid(),
                    created_at: fn_getDatetime(),
                    updated_at: fn_getDatetime()
                });
                let result = await adminModel.clone().insert(insertData);
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
