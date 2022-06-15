import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/dictionary.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新字典`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema,
                    pid: tableData.pid.schema,
                    name: tableData.name.schema,
                    value: tableData.value.schema,
                    type: tableData.type.schema,
                    describe: tableData.describe.schema
                },
                required: ['id', 'type']
            }
        },

        handler: async function (req, res) {
            try {
                if (req.body.type === 'number') {
                    if (Number.isNaN(Number(req.body.value)) === true) {
                        return { ...constantConfig.code.FAIL_UPDATE, msg: '字典值不是一个数字类型' };
                    }
                }
                let model = fastify.mysql //
                    .table(tableName)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let data = {
                    pid: req.body.pid,
                    name: req.body.name,
                    value: req.body.value,
                    type: req.body.type,
                    describe: req.body.describe,
                    updated_at: utils.getDatetime()
                };
                let result = await model.update(utils.clearEmptyData(data));
                return constantConfig.code.SUCCESS_UPDATE;
            } catch (err) {
                console.log('🚀 ~ file: update.js ~ line 51 ~ err', err);
                return constantConfig.code.FAIL_UPDATE;
            }
        }
    });
}
