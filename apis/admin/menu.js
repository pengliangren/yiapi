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
            summary: `查询管理员菜单权限`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {}
            }
        },

        handler: async function (req, res) {
            try {
                const userMenus = await fastify.getUserMenus(req.user);
                return {
                    ...constantConfig.code.SUCCESS_SELECT,
                    data: {
                        rows: userMenus
                    }
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_SELECT;
            }
        }
    });
}
