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
            summary: `更新管理员`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema,
                    password: tableData.password.schema,
                    nickname: tableData.nickname.schema,
                    role_codes: tableData.role_codes.schema
                },
                required: ['id']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    password: utils.MD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes,
                    updated_at: utils.getDatetime()
                };

                let updateResult = await model.update(utils.clearEmptyData(data));

                return constantConfig.code.SUCCESS_UPDATE;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_UPDATE;
            }
        }
    });
}
