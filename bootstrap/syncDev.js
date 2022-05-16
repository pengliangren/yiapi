import fp from 'fastify-plugin';
import fs from 'fs-extra';
import md5 from 'blueimp-md5';
import { nanoid } from 'nanoid';
import { keyBy as _keyBy, omitBy as _omitBy, forEach as _forEach, isEmpty as _isEmpty } from 'lodash-es';
import { fn_getDatetime, fn_clearEmptyData, fn_MD5 } from '../utils/index.js';
import appConfig from '../config/app.js';
import roleConfig from '../config/role.js';

async function main(fastify, opts) {
    // 同步接口
    try {
        // 准备好表
        let permissionModel = fastify.mysql.table('permission');
        let adminModel = fastify.mysql.table('admin');
        let roleModel = fastify.mysql.table('role');

        // 查询所有角色
        let roleData = await roleModel.clone().select();
        let roleCodes = roleData.map((item) => item.code);

        // 查询开发管理员
        let devAdminData = await adminModel.clone().where('account', 'dev').first();
        // 查询开发角色
        let devRoleData = await roleModel.clone().where('code', 'dev').first();

        // 请求菜单数据，用于给开发管理员绑定菜单
        let menuData = await permissionModel.clone().where('tag', 'menu').select();
        let menuIds = menuData.map((item) => item.id);

        // 请求接口数据，用于给开发管理员绑定接口
        let apiData = await permissionModel.clone().where('tag', 'api').select();
        let apiIds = apiData.map((item) => item.id);

        // 获取缓存的角色数据
        // let cacheRoleData = fs.readJsonSync('../data/roleData.json') || {};
        // let cacheRoleDataObjectByCode = _keyBy(cacheRoleData, 'code');

        // 需要同步的角色，过滤掉数据库中已经存在的角色
        let initRole = roleConfig.filter((item) => {
            let isExists = roleCodes.includes(item.code);
            if (isExists === false) {
                // let currentRoleData = cacheRoleDataObjectByCode[item.code];
                // if (currentRoleData) {
                //     item.api_ids = currentRoleData.api_ids;
                //     item.menu_ids = currentRoleData.menu_ids;
                // }
                item.created_at = fn_getDatetime();
                item.updated_at = fn_getDatetime();
            }

            return isExists === false;
        });

        if (initRole.length > 0) {
            await roleModel.clone().insert(initRole);
        }

        // 存储开发管理员角色对应的ID值
        let devRoleId = null;

        /**
         * 如果没有开发角色，则创建之
         * 如果有开发角色，则更新之
         */
        if (!devRoleData) {
            devRoleId = await roleModel.clone().insert({
                code: 'dev',
                name: '开发管理员',
                describe: '技术性相关的管理和维护',
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(','),
                created_at: fn_getDatetime(),
                updated_at: fn_getDatetime()
            });
        } else {
            await roleModel
                .clone()
                .where('code', 'dev')
                .update({
                    menu_ids: menuIds.join(','),
                    api_ids: apiIds.join(','),
                    updated_at: fn_getDatetime()
                });
        }

        // 如果没有开发管理员，则创建之
        if (!devAdminData) {
            let insertApiData = fn_clearEmptyData({
                uuid: nanoid(),
                account: 'dev',
                nickname: '开发管理员',
                role_codes: 'dev',
                password: fn_MD5(md5(appConfig.devPassword)),
                created_at: fn_getDatetime(),
                updated_at: fn_getDatetime()
            });
            await adminModel.clone().insert(insertApiData);
        }

        console.log('开发角色和管理自动同步成功');
    } catch (err) {
        fastify.log.error(err);
        console.log('开发角色和管理自动同步失败');
    }
}
export default fp(main, { name: 'sync', dependencies: ['mysql', 'sequelize', 'redis', 'tool', 'syncApi', 'syncMenu'] });
