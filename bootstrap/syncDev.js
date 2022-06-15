import fp from 'fastify-plugin';
import fs from 'fs-extra';
import md5 from 'blueimp-md5';
import { nanoid } from 'nanoid';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { appConfig } from '../config/app.js';
import { roleConfig } from '../config/role.js';

async function main(fastify, opts) {
    // 同步接口
    try {
        // 准备好表
        let treeModel = fastify.mysql.table('tree');
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
        let menuData = await treeModel.clone().where('type', 'menu').select();
        let menuIds = menuData.map((item) => item.id);

        // 请求接口数据，用于给开发管理员绑定接口
        let apiData = await treeModel.clone().where('type', 'api').select();
        let apiIds = apiData.map((item) => item.id);

        // 获取缓存的角色数据
        // let cacheRoleData = fs.readJsonSync('../data/roleData.json') || {};
        // let cacheRoleDataObjectByCode = _.keyBy(cacheRoleData, 'code');

        // 需要同步的角色，过滤掉数据库中已经存在的角色
        let initRole = roleConfig.filter((item) => {
            let isExists = roleCodes.includes(item.code);
            if (isExists === false) {
                // let currentRoleData = cacheRoleDataObjectByCode[item.code];
                // if (currentRoleData) {
                //     item.api_ids = currentRoleData.api_ids;
                //     item.menu_ids = currentRoleData.menu_ids;
                // }
                item.created_at = utils.getDatetime();
                item.updated_at = utils.getDatetime();
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
                created_at: utils.getDatetime(),
                updated_at: utils.getDatetime()
            });
        } else {
            await roleModel
                .clone()
                .where('code', 'dev')
                .update({
                    menu_ids: menuIds.join(','),
                    api_ids: apiIds.join(','),
                    updated_at: utils.getDatetime()
                });
        }

        // 如果没有开发管理员，则创建之
        if (!devAdminData) {
            let insertApiData = utils.clearEmptyData({
                uuid: nanoid(),
                account: 'dev',
                nickname: '开发管理员',
                role_codes: 'dev',
                password: utils.MD5(md5(appConfig.devPassword)),
                created_at: utils.getDatetime(),
                updated_at: utils.getDatetime()
            });
            await adminModel.clone().insert(insertApiData);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(main, { name: 'sync', dependencies: ['mysql', 'sequelize', 'redis', 'tool', 'syncApi', 'syncMenu'] });
