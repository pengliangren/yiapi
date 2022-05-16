import { omit as _omit, merge as _merge } from 'lodash-es';
import { fn_getFileInfos, fn_MD5 } from '../../utils/index.js';
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
                    phone: userTable.phone.schema,
                    password: userTable.password.schema
                },
                required: ['phone', 'password']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let userModel = fastify.mysql.table('user').where({ phone: req.body.phone });
                // 查询用户是否存在
                let result = await userModel.first();
                // 判断用户存在
                if (result === undefined) {
                    return _merge(constant.code.FAIL, { msg: '用户不存在' });
                }

                // 判断密码
                if (fn_MD5(req.body.password) !== result.password) {
                    return _merge(constant.code.FAIL, { msg: '密码错误' });
                }

                let dataRoleCodes = await fastify.redisGet('dataRole', 'json');
                let roleCodesArray = result.role_codes.split(',');
                let role_codes = [];
                dataRoleCodes.forEach((item) => {
                    if (roleCodesArray.includes(item.id)) {
                        role_codes.push(item.code);
                    }
                });
                // 成功返回
                return _merge(constant.code.SUCCESS, {
                    msg: '登录成功',
                    data: _omit(result, ['password']),
                    token: await fastify.jwt.sign({
                        id: result.id,
                        uuid: result.uuid,
                        type: result.type,
                        account: result.account,
                        role_codes: result.role_codes,
                        state: result.state
                    })
                });
            } catch (err) {
                fastify.log.error(err);
                // 成功返回
                return _merge(constant.code.FAIL, { msg: '登录失败' });
            }
        }
    });
}
