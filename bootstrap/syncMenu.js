import fp from 'fastify-plugin';
import { keyBy as _keyBy, omitBy as _omitBy, forEach as _forEach, isEmpty as _isEmpty } from 'lodash-es';
import { fn_getDatetime, fn_clearEmptyData, fn_MD5 } from '../utils/index.js';
import menuConfig from '../config/menu.js';

async function main(fastify, opts) {
    // 同步接口
    try {
        // 准备好表
        let permissionModel = fastify.mysql.table('permission');

        // 第一次请求菜单数据，用于创建一级菜单
        let menuData1 = await permissionModel.clone().where('tag', 'menu').select();
        let menuNames1 = menuData1.map((item) => item.name);

        // 将要添加的接口数据
        let insertMainMenuData = [];
        _forEach(menuConfig.mainMenu, (item) => {
            if (menuNames1.includes(item.name) === false) {
                insertMainMenuData.push({
                    name: item.name,
                    tag: 'menu',
                    value: item.value,
                    level: 1,
                    pids: '0',
                    pid: 0,
                    sort: 0,
                    is_open: 0,
                    describe: '',
                    created_at: fn_getDatetime(),
                    updated_at: fn_getDatetime()
                });
            }
        });

        if (_isEmpty(insertMainMenuData) === false) {
            await permissionModel.clone().insert(insertMainMenuData);
        }

        // 第二次请求菜单数据，用于创建二级菜单
        let menuData2 = await permissionModel.clone().where('tag', 'menu').select();
        let menuNames2 = menuData2.map((item) => item.name);
        let menuDataByName = _keyBy(menuData2, 'name');

        // 待添加的子菜单（二级菜单）
        let insertSubMenuData = [];
        _forEach(menuConfig.subMenu, (item) => {
            if (menuNames2.includes(item.name) === false) {
                let parentMenuData = menuDataByName[item.parent] || null;
                if (parentMenuData) {
                    insertSubMenuData.push({
                        name: item.name,
                        tag: 'menu',
                        value: item.value,
                        level: 2,
                        pids: `0,${parentMenuData.id}`,
                        pid: parentMenuData.id,
                        sort: 0,
                        is_open: 0,
                        describe: '',
                        created_at: fn_getDatetime(),
                        updated_at: fn_getDatetime()
                    });
                }
            }
        });

        if (_isEmpty(insertSubMenuData) === false) {
            await permissionModel.clone().insert(insertSubMenuData);
        }

        console.log('菜单自动同步成功');
    } catch (err) {
        fastify.log.error(err);
        console.log('菜单自动同步失败');
    }
}
export default fp(main, { name: 'syncMenu', dependencies: ['mysql', 'sequelize', 'redis', 'tool'] });
