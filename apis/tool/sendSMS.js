import { random as _random, merge as _merge } from 'lodash-es';
import { fn_getFileInfos } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import { sendSMS } from '../../utils/sms.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'string',
                        type: 'string',
                        minLength: 7,
                        maxLength: 11,
                        title: '手机号'
                    }
                },
                required: ['phone']
            }
        },
        config: {},
        handler: async function (req, res) {
            try {
                let cacheVerifyCode = await fastify.redis.get(`registerPhone_${req.body.phone}`);
                if (cacheVerifyCode) {
                    return _merge(constant.code.FAIL, { msg: '短信已发送，请查收或5分钟后再试' });
                }
                let verifyCode = _random(1000, 9999);

                let result = await sendSMS(req.body.phone, verifyCode);

                if (result && result.body.code === 'OK') {
                    await fastify.redis.set(`registerPhone_${req.body.phone}`, verifyCode, 'EX', 60 * 5);
                    return _merge(constant.code.SUCCESS, { msg: '短信发送成功' });
                } else {
                    fastify.log.error(result);
                    return _merge(constant.code.FAIL, { msg: '短信发送失败' });
                }
            } catch (err) {
                fastify.log.error(err);
                return _merge(constant.code.FAIL, { msg: '短信发送错误' });
            }
        }
    });
}
