import { merge as _merge } from 'lodash-es';
import { nanoid } from 'nanoid';
import { fn_getFileInfos, fn_MD5, fn_getDatetime } from '../../utils/index.js';
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
                    password: userTable.password.schema,
                    verifyCode: {
                        type: 'string',
                        minLength: 4,
                        maxLength: 4,
                        title: '验证码'
                    }
                },
                required: ['phone', 'password', 'verifyCode']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let model = fastify.mysql.table('user');
                /**
                 * 根据手机好，查询用户是否存在
                 * TODO: 如果后面增加邮箱，账号等登录方式
                 * 则采取或逻辑进行判断
                 */
                let resultA = await model.clone().where({ phone: req.body.phone }).first();

                // 若用户存在则提示该用户已存在
                if (resultA) {
                    return _merge(constant.code.FAIL, { msg: '用户已存在' });
                }

                let cacheVerifyCode = await fastify.redis.get(`registerPhone_${req.body.phone}`);
                if (!cacheVerifyCode) {
                    return _merge(constant.code.FAIL, { msg: '未发送验证码或验证码已过期，请重新发送' });
                }

                if (cacheVerifyCode != req.body.verifyCode) {
                    return _merge(constant.code.FAIL, { msg: '验证码错误' });
                }

                // 若用户不存在则创建该用户
                let resultB = await model.clone().insert({
                    phone: req.body.phone,
                    password: fn_MD5(req.body.password),
                    uuid: nanoid(),
                    role_codes: 'user',
                    created_at: fn_getDatetime(),
                    updated_at: fn_getDatetime()
                });
                return _merge(constant.code.SUCCESS, {
                    msg: '注册成功',
                    data: resultB
                });
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL;
            }
        }
    });
}
