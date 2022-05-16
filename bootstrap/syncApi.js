import fp from 'fastify-plugin';
import fg from 'fast-glob';
import { keyBy as _keyBy, omitBy as _omitBy, forEach as _forEach, isEmpty as _isEmpty } from 'lodash-es';
import { fn_getDatetime, fn_clearEmptyData, fn_MD5 } from '../utils/index.js';
import apiConfig from '../config/api.js';

async function main(fastify, opts) {
    // 同步接口
    try {
        // 准备好表
        let permissionModel = fastify.mysql.table('permission');

        // 查询所有接口权限
        let apis = await permissionModel.clone().where('tag', 'api');

        // 区分虚拟和真实
        let apiType0 = apis.filter((item) => item.type === 0);
        let apiType1 = apis.filter((item) => item.type === 1);

        // 获取
        let apiType0Value = apiType0.map((item) => item.value);
        let apiType1Value = apiType1.map((item) => item.value);

        // 待添加的接口目录
        let insertApiType0 = apiConfig.filter((item) => {
            if (apiType0Value.includes(item.value) === false) {
                item.created_at = fn_getDatetime();
                item.updated_at = fn_getDatetime();
                return true;
            } else {
                return false;
            }
        });

        if (_isEmpty(insertApiType0) === false) {
            await permissionModel.clone().insert(insertApiType0);
        }

        // 查询所有接口权限
        let apisType0 = await permissionModel.clone().where({ tag: 'api', type: 0 });
        let apiType0Object = _keyBy(apisType0, 'value');
        let apiType1Object = _keyBy(apiType1, 'value');

        // 将要添加的接口数据
        let insertApiData = [];
        // 将要删除的接口数据
        let deleteApiData = [];
        // 将要修改的数据
        let updateApiData = [];
        // 自动生成的接口路径
        let autoApiPaths = [];

        // 遍历项目接口文件
        let files = fg.sync('./apis/**/*', { onlyFiles: true, dot: false }).forEach((file) => {
            let fileName = file.replace('\\+', '/').replace('.js', '').replace('./apis', '');
            let parentValue = '/' + fileName.split('/')[1];
            let parentApi = apiType0Object[parentValue] || {};
            autoApiPaths.push(fileName);

            // 如果当前接口不存在，则添加接口
            if (apiType1Value.includes(fileName) === false) {
                let apiParams = {
                    pid: 0,
                    name: fileName,
                    value: fileName,
                    icon: '',
                    sort: 0,
                    is_open: 0,
                    describe: '',
                    tag: 'api',
                    pids: '0',
                    level: 1,
                    type: 1,
                    created_at: fn_getDatetime(),
                    updated_at: fn_getDatetime()
                };
                if (_isEmpty(parentApi) === false) {
                    apiParams.pid = parentApi.id;
                    apiParams.pids = `0,${parentApi.id}`;
                    apiParams.level = 2;
                }
                insertApiData.push(apiParams);
            } else {
                let currentApi = apiType1Object[fileName] || {};
                if (_isEmpty(currentApi) === false && _isEmpty(parentApi) === false && currentApi.pid === 0) {
                    updateApiData.push({
                        id: currentApi.id,
                        pid: parentApi.id,
                        pids: `0,${parentApi.id}`,
                        level: 2,
                        updated_at: fn_getDatetime()
                    });
                }
            }
        });

        // 需要删除的接口
        apiType1.forEach((item) => {
            // 如果自动接口里面不包含已经存在的接口，则删除掉
            if (autoApiPaths.includes(item.value) === false && item.value !== '') {
                deleteApiData.push(item.id);
            }
        });

        // 如果待增加接口大于0，则增加
        if (_isEmpty(insertApiData) === false) {
            await permissionModel.clone().insert(insertApiData);
        }

        // 如果待更新接口大于0，则更新
        if (_isEmpty(updateApiData) === false) {
            for (let item of updateApiData) {
                await permissionModel.clone().where('id', item.id).update(_omit(item, 'id'));
            }
        }

        // 如果待删除接口大于0，则删除
        if (_isEmpty(deleteApiData) === false) {
            await permissionModel.clone().whereIn('id', deleteApiData).delete();
        }

        // 将接口缓存到redis中
        await fastify.cachePermissionData();

        console.log('接口自动同步成功');
    } catch (err) {
        fastify.log.error(err);
        console.log('接口自动同步失败');
    }
}
export default fp(main, { name: 'syncApi', dependencies: ['tool'] });
