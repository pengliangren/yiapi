import * as _ from 'lodash-es';
import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/tree.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新树`,
            tags: [apiInfo.parentDirname],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema,
                    pid: tableData.pid.schema,
                    type: tableData.type.schema,
                    name: tableData.name.schema,
                    value: tableData.value.schema,
                    icon: tableData.icon.schema,
                    sort: tableData.sort.schema,
                    describe: tableData.describe.schema,
                    is_bool: tableData.is_bool.schema,
                    is_open: tableData.is_open.schema
                },
                required: ['id']
            }
        },

        handler: async function (req, res) {
            const trxProvider = fastify.mysql.transactionProvider();
            const trx = await trxProvider();
            try {
                let model = trx.table(tableName);

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await model.clone().where('id', req.body.pid).first();
                    if (parentData === undefined) {
                        return { ...constantConfig.code.FAIL, msg: '父级树不存在' };
                    }
                }

                let selfData = await model.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return { ...constantConfig.code.FAIL, msg: '菜单不存在' };
                }

                // 需要更新的数据
                let data = {
                    pid: req.body.pid,
                    type: req.body.type,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    is_bool: req.body.is_bool,
                    describe: req.body.describe,
                    pids: req.body.pids,
                    updated_at: utils.getDatetime()
                };

                if (parentData !== undefined) {
                    data.pids = [parentData.pids, parentData.id].join(',');
                }
                let updateResult = await model
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(utils.clearEmptyData(data));

                // 如果更新成功，则更新所有子级
                if (updateResult) {
                    let childrenPids = [data.pids || selfData.pid, req.body.id];
                    await model
                        .clone()
                        .where({ pid: req.body.id })
                        .update({
                            pids: childrenPids.join(','),
                            level: childrenPids.length,
                            updated_at: utils.getDatetime()
                        });
                }

                await trx.commit();
                await fastify.cacheTreeData();
                return constantConfig.code.SUCCESS_UPDATE;
            } catch (err) {
                await trx.rollback();
                fastify.logError(err);
                return constantConfig.code.FAIL_UPDATE;
            }
        }
    });
}
