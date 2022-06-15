import fp from 'fastify-plugin';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { menuConfig } from '../config/menu.js';

// 同步菜单目录
async function syncMenuDir(fastify) {
    // 准备好表
    let treeModel = fastify.mysql.table('tree');

    // 第一次请求菜单数据，用于创建一级菜单
    let menuData = await treeModel.clone().where('type', 'menu').select();
    let menuName = menuData.map((item) => item.name);

    // 将要添加的接口数据
    let insertMenuDir = [];
    _.forEach(menuConfig, (item, index) => {
        if (menuName.includes(item.name) === false) {
            insertMenuDir.push({
                type: 'menu',
                name: item.name,
                value: item.value,
                level: 1,
                pids: '0',
                pid: 0,
                sort: index,
                is_open: 0,
                describe: item.describe || '',
                created_at: utils.getDatetime(),
                updated_at: utils.getDatetime()
            });
        }
    });

    if (_.isEmpty(insertMenuDir) === false) {
        await treeModel.clone().insert(insertMenuDir);
    }
}

// 同步菜单文件
async function syncMenuFile(fastify) {
    // 准备好表
    let treeModel = fastify.mysql.table('tree');

    // 第二次请求菜单数据，用于创建二级菜单
    let menuData = await treeModel.clone().where('type', 'menu').select();

    // 菜单名数组
    let menuValueArray = menuData.map((item) => item.value);

    // 菜单名对象
    let menuValueObject = _.keyBy(menuData, 'value');

    // 待添加的子菜单（二级菜单）
    let insertMenuFile = [];

    _.forEach(menuConfig, (mainItem) => {
        _.forEach(mainItem.children, (item, index) => {
            if (menuValueArray.includes(item.value) === false) {
                let parentMenuData = menuValueObject[mainItem.value] || null;
                if (parentMenuData) {
                    insertMenuFile.push({
                        type: 'menu',
                        name: item.name,
                        value: item.value,
                        level: 2,
                        pids: `0,${parentMenuData.id}`,
                        pid: parentMenuData.id,
                        sort: index,
                        is_open: 0,
                        describe: item.describe || '',
                        created_at: utils.getDatetime(),
                        updated_at: utils.getDatetime()
                    });
                }
            }
        });
    });

    if (_.isEmpty(insertMenuFile) === false) {
        await treeModel.clone().insert(insertMenuFile);
    }
}

async function main(fastify) {
    // 同步接口
    try {
        await syncMenuDir(fastify);
        await syncMenuFile(fastify);
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(main, { name: 'syncMenu', dependencies: ['mysql', 'sequelize', 'redis', 'tool'] });
