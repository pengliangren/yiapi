import { nanoid } from 'nanoid';
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
            summary: `添加管理员`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    account: tableData.account.schema,
                    password: tableData.password.schema,
                    nickname: tableData.nickname.schema,
                    role_codes: tableData.role_codes.schema
                },
                required: ['account', 'password', 'nickname']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});
                let _result = await model.clone().orWhere('account', req.body.account).orWhere('nickname', req.body.nickname).first();
                if (_result !== undefined) {
                    return _.merge(constantConfig.code.FAIL, { msg: '管理员账号或昵称已存在' });
                }

                let data = {
                    account: req.body.account,
                    password: utils.MD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes,
                    uuid: nanoid(),
                    created_at: utils.getDatetime(),
                    updated_at: utils.getDatetime()
                };

                let result = await model.clone().insert(utils.clearEmptyData(data));
                return {
                    ...constantConfig.code.SUCCESS_INSERT,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_INSERT;
            }
        }
    });
}
