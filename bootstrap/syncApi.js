import fp from 'fastify-plugin';
import fg from 'fast-glob';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { apiConfig } from '../config/api.js';

// 同步接口目录
async function syncApiDir(fastify) {
    // 准备好表
    let treeModel = fastify.mysql.table('tree');

    // 查询所有接口权限，包括接口目录和接口
    let apis = await treeModel.clone().where('type', 'api');

    // 区分虚拟和真实
    let apisDir = apis.filter((item) => item.is_bool === 0);

    // 获取所有的值数组
    let apiDirValue = apisDir.map((item) => item.value);

    // 待添加的接口目录，如果不在配置文件里面，则新增
    let insertApiDir = apiConfig.filter((item) => {
        if (apiDirValue.includes(item.value) === false) {
            item.type = 'api';
            item.is_bool = 0;
            item.created_at = utils.getDatetime();
            item.updated_at = utils.getDatetime();
            return true;
        } else {
            return false;
        }
    });

    // 如果没有要新增的接口目录，则不进行添加操作，以免报错
    if (_.isEmpty(insertApiDir) === false) {
        await treeModel.clone().insert(insertApiDir);
    }
}

// 同步接口文件
async function syncApiFile(fastify) {
    // 准备好表
    let treeModel = fastify.mysql.table('tree');

    // 接口目录同步完毕后，重新查询一遍接口目录，拿到所有的接口目录
    let apis = await treeModel.clone().where({ type: 'api' });

    let apisDir = apis.filter((item) => item.is_bool === 0);
    let apisFile = apis.filter((item) => item.is_bool === 1);

    // 所有的接口文件值数组
    let apiDirValue = apisDir.map((item) => item.value);
    let apiFileValue = apisFile.map((item) => item.value);
    let apiDirByValue = _.keyBy(apisDir, 'value');
    let apiFileByValue = _.keyBy(apisFile, 'value');

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
        let apiFileName = file.replace('\\+', '/').replace('.js', '').replace('./apis', '');
        let parentApiValue = '/' + apiFileName.split('/')[1];
        let parentApiData = apiDirByValue[parentApiValue] || {};

        autoApiPaths.push(apiFileName);

        if (apiFileValue.includes(apiFileName) === false) {
            // 如果当前接口不存在，则添加接口
            let apiParams = {
                pid: 0,
                type: 'api',
                name: apiFileName,
                value: apiFileName,
                icon: '',
                sort: 0,
                is_open: 0,
                describe: '',
                pids: '0',
                level: 1,
                is_bool: 1,
                created_at: utils.getDatetime(),
                updated_at: utils.getDatetime()
            };
            if (_.isEmpty(parentApiData) === false) {
                apiParams.pid = parentApiData.id;
                apiParams.pids = `0,${parentApiData.id}`;
                apiParams.level = 2;
            }
            insertApiData.push(apiParams);
        } else {
            // 如果当前接口存在，且父级接口目录也存在，且父级pid为0的野生接口，则更新修改接口文件信息
            let currentApi = apiFileValue[apiFileName] || {};
            if (_.isEmpty(currentApi) === false && _.isEmpty(parentApiData) === false && currentApi.pid === 0) {
                updateApiData.push({
                    id: currentApi.id,
                    pid: parentApiData.id,
                    pids: `0,${parentApiData.id}`,
                    level: 2,
                    updated_at: utils.getDatetime()
                });
            }
        }
    });

    // 需要删除的接口
    apisFile.forEach((item) => {
        // 如果自动接口里面不包含已经存在的接口，则删除掉
        if (autoApiPaths.includes(item.value) === false && item.value !== '') {
            deleteApiData.push(item.id);
        }
    });

    // 如果待增加接口大于0，则增加
    if (_.isEmpty(insertApiData) === false) {
        await treeModel.clone().insert(insertApiData);
    }

    // 如果待更新接口大于0，则更新
    if (_.isEmpty(updateApiData) === false) {
        for (let item of updateApiData) {
            await treeModel.clone().where('id', item.id).update(_.omit(item, 'id'));
        }
    }

    // 如果待删除接口大于0，则删除
    if (_.isEmpty(deleteApiData) === false) {
        await treeModel.clone().whereIn('id', deleteApiData).delete();
    }
}

async function main(fastify) {
    // 同步接口
    try {
        await syncApiDir(fastify);
        await syncApiFile(fastify);
        // 将接口缓存到redis中
        await fastify.cacheTreeData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(main, { name: 'syncApi', dependencies: ['mysql', 'sequelize', 'redis', 'tool'] });
