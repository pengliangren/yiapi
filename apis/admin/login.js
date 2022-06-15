import * as _ from 'lodash-es';

import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/admin.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            tags: [apiInfo.parentDirname],
            summary: `管理员登录`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    account: tableData.account.schema,
                    password: tableData.password.schema
                },
                required: ['account', 'password']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql
                    .table(tableName)
                    //
                    .orWhere({ account: req.body.account })
                    .orWhere({ phone: req.body.account })
                    .orWhere({ weixin: req.body.account })
                    .orWhere({ qq: req.body.account });

                console.log(model.toString());
                // 查询用户是否存在
                let result = await model.clone().first();
                // 判断用户存在
                if (result === undefined) {
                    return _.merge(constantConfig.code.FAIL, { msg: '用户不存在' });
                }

                // 判断密码
                if (utils.MD5(req.body.password) !== result.password) {
                    return _.merge(constantConfig.code.FAIL, { msg: '密码错误' });
                }

                let dataRoleCodes = await fastify.redisGet('cacheData:role', 'json');
                let roleCodesArray = result.role_codes.split(',');
                let role_codes = [];
                dataRoleCodes.forEach((item) => {
                    if (roleCodesArray.includes(item.id)) {
                        role_codes.push(item.code);
                    }
                });

                // 成功返回
                return _.merge(constantConfig.code.SUCCESS, {
                    msg: '登录成功',
                    data: result,
                    token: await fastify.jwt.sign({
                        id: result.id,
                        uuid: result.uuid,
                        account: result.account,
                        role_codes: result.role_codes,
                        state: result.state
                    })
                });
            } catch (err) {
                fastify.logError(err);
                return _.merge(constantConfig.code.FAIL, { msg: '登录失败' });
            }
        }
    });
}
