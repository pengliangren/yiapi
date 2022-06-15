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
            summary: `查询所有字典`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    pid: tableData.pid.schema,
                    keywords: schemaConfig.keywords
                }
            }
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql.table(tableName).where('pid', req.body.pid);
                let resultData = await model.clone().select();

                let rows = resultData.map((item) => {
                    if (item.type === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });
                return {
                    ...constantConfig.code.SUCCESS_SELECT,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_SELECT;
            }
        }
    });
}
