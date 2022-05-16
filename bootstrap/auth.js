import { find as _find, merge as _merge } from 'lodash-es';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import dayjs from 'dayjs';

import jwt from '../config/jwt.js';
import appConfig from '../config/app.js';
import constant from '../config/constant.js';
import { fn_routerPath, fn_checkParams } from '../utils/index.js';

async function main(fastify, opts) {
    fastify.register(fastifyJwt, {
        secret: jwt.secret,
        decode: {
            complete: true
        },
        sign: {
            algorithm: jwt.algorithm,
            expiresIn: jwt.expiresIn
        },
        verify: {
            algorithms: [jwt.algorithm]
        }
    });

    fastify.addHook('preValidation', async (req, res) => {
        try {
            // 取得请求API路径
            req.apiPath = fn_routerPath(req.url);

            // 参数检测
            let checkParams = await fn_checkParams(req);

            // 获取白名单接口
            const dataApiWhiteLists = await fastify.redisGet('dataApiWhiteLists', 'json');

            // 设置默认访问角色为游客
            let visitor = {
                role_codes: 'visitor'
            };

            // 如果接口在白名单中，则直接请求访问
            if (appConfig.whiteLists.includes(req.apiPath) || dataApiWhiteLists.includes(req.apiPath)) {
                if (req.headers.authorization) {
                    const jwtData = fastify.jwt.decode(req.headers.authorization?.split(' ')?.[1] || '666666') || {};
                    req.user = jwtData.payload || visitor;
                } else {
                    req.user = visitor;
                }
            } else {
                try {
                    await req.jwtVerify();
                } catch (err) {
                    req.user = visitor;
                }

                const userApis = await fastify.getUserApis(req.user);

                // 如果当前请求的路由，不在用户许可内
                if (!_find(userApis, { value: req.apiPath })) {
                    if (req.user.uuid) {
                        res.send(_merge(constant.code.FAIL, { msg: `您没有 [ ${req.apiPath} ] 接口操作权限` }));
                        return;
                    } else {
                        res.send(constant.code.NOT_LOGIN);
                        return;
                    }
                }
            }
        } catch (err) {
            fastify.log.error(err);
            res.send(_merge(constant.code.FAIL, { msg: err.msg || '认证异常' }));
            return;
        }
    });
}
export default fp(main, { dependencies: ['cors', 'mysql'] });
