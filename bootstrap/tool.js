import fp from 'fastify-plugin';
import fs from 'fs-extra';

async function tool(fastify, opts) {
    fastify.decorate('redisSet', async (key, value, type = 'text') => {
        if (type === 'json') {
            await fastify.redis.set(key, JSON.stringify(value));
        }
        if (type === 'text') {
            await fastify.redis.set(key, value);
        }
    });
    fastify.decorate('redisGet', async (key, type = 'text') => {
        if (type === 'json') {
            let result = await fastify.redis.get(key);
            return JSON.parse(result);
        }
        if (type === 'text') {
            let result = await fastify.redis.get(key);
            return result;
        }
    });

    // 获取当前登录用户可操作的接口列表
    fastify.decorate('getUserApis', async (session) => {
        // 提取当前用户的角色码组
        let userRoleCodes = session.role_codes.split(',').filter((code) => code !== '');

        // 提取所有角色拥有的接口
        let apiIds = [];
        let dataRoleCodes = await fastify.redisGet('cacheData:role', 'json');
        dataRoleCodes.forEach((item) => {
            if (userRoleCodes.includes(item.code)) {
                apiIds = item.api_ids
                    .split(',')
                    .filter((id) => id !== '')
                    .map((id) => Number(id))
                    .concat(apiIds);
            }
        });

        // 将接口进行唯一性处理
        let uniqApiIds = [...new Set(apiIds)];

        let dataApi = await fastify.redisGet('cacheData:api', 'json');

        // 最终的用户接口列表
        let result = dataApi
            .filter((item) => {
                return uniqApiIds.includes(item.id);
            })
            .map((item) => {
                return item;
            });
        return result;
    });

    // 获取用户的菜单
    fastify.decorate('getUserMenus', async (session) => {
        try {
            // 所有角色数组
            let userRoleCodes = session.role_codes.split(',').filter((code) => code !== '');

            // 所有菜单ID
            let menuIds = [];
            const dataRoleCodes = await fastify.redisGet('cacheData:role', 'json');
            dataRoleCodes.forEach((item) => {
                if (userRoleCodes.includes(item.code)) {
                    menuIds = item.menu_ids
                        .split(',')
                        .filter((id) => id !== '')
                        .map((id) => Number(id))
                        .concat(menuIds);
                }
            });

            const userMenu = [...new Set(menuIds)];
            const dataMenu = await fastify.redisGet('cacheData:menu', 'json');

            let result = dataMenu.filter((item) => {
                return userMenu.includes(item.id);
            });
            return result;
        } catch (err) {
            fastify.log.error(err);
        }
    });

    // 设置权限数据
    fastify.decorate('cacheTreeData', async () => {
        // 菜单列表
        let dataMenu = await fastify.mysql //
            .table('tree')
            .where({ type: 'menu' })
            .select();

        // 接口列表
        let dataApi = await fastify.mysql //
            .table('tree')
            .where({ type: 'api' })
            .select();

        // 白名单接口
        let dataApiWhiteLists = dataApi.filter((item) => item.is_open === 1).map((item) => item.value);

        // 先置空再设置
        fastify.redisSet('cacheData:menu', [], 'json');
        fastify.redisSet('cacheData:menu', dataMenu, 'json');

        // 先置空再设置
        fastify.redisSet('cacheData:api', [], 'json');
        fastify.redisSet('cacheData:api', dataApi, 'json');

        // 先置空再设置
        fastify.redisSet('cacheData:apiWhiteLists', [], 'json');
        fastify.redisSet('cacheData:apiWhiteLists', dataApiWhiteLists, 'json');
    });

    // 设置角色数据
    fastify.decorate('cacheRoleData', async () => {
        // 角色类别
        let dataRole = await fastify.mysql //
            .table('role')
            .where({ state: 0 })
            .select();

        await fastify.redisSet('cacheData:role', [], 'json');
        await fastify.redisSet('cacheData:role', dataRole, 'json');
        // fs.outputJsonSync('./data/roleData.json', dataRole);
    });

    fastify.decorate('logError', (logData) => {
        fastify.log.error(logData);
    });

    fastify.decorate('logInfo', (logData) => {
        fastify.log.info(logData);
    });

    fastify.decorate('logWarn', (logData) => {
        fastify.log.warn(logData);
    });

    fastify.decorate('logDebug', (logData) => {
        fastify.log.debug(logData);
    });
}
export default fp(tool, { name: 'tool', dependencies: ['sequelize', 'mysql', 'redis'] });
