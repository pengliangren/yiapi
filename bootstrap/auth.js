import * as _ from 'lodash-es';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import dayjs from 'dayjs';
import micromatch from 'micromatch';

import { jwtConfig } from '../config/jwt.js';
import { appConfig } from '../config/app.js';
import { constantConfig } from '../config/constant.js';
import * as utils from '../utils/index.js';

async function main(fastify, opts) {
    fastify.register(fastifyJwt, {
        secret: jwtConfig.secret,
        decode: {
            complete: true
        },
        sign: {
            algorithm: jwtConfig.algorithm,
            expiresIn: jwtConfig.expiresIn
        },
        verify: {
            algorithms: [jwtConfig.algorithm]
        }
    });

    fastify.addHook('preValidation', async (req, res) => {
        try {
            // 取得请求API路径
            req.apiPath = utils.routerPath(req.url);

            // 参数检测
            await utils.checkApiParams(req);

            // 从缓存获取白名单接口
            const dataApiWhiteLists = await fastify.redisGet('cacheData:apiWhiteLists', 'json');

            // 设置默认访问角色为游客
            let visitor = {
                role_codes: 'visitor'
            };

            let isWhitePass = micromatch.isMatch(req.apiPath, appConfig.whiteLists);

            // 如果接口在白名单中，则直接请求访问
            if (isWhitePass) {
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

                let hasApi = _.find(userApis, { value: req.apiPath });

                // 如果当前请求的路由，不在用户许可内
                if (!hasApi) {
                    if (req.user.id) {
                        res.send(_.merge(constantConfig.code.FAIL, { msg: `您没有 [ ${req.apiPath} ] 接口操作权限` }));
                    } else {
                        res.send(constantConfig.code.NOT_LOGIN);
                    }
                }
            }
        } catch (err) {
            fastify.logError(err);
            res.send(_.merge(constantConfig.code.FAIL, { msg: err.msg || '认证异常' }));
        }
    });
}
export default fp(main, { dependencies: ['cors', 'mysql'] });
