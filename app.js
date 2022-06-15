import path from 'path';
import fs from 'fs-extra';
import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import localize from 'ajv-i18n';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import * as sequelize from 'sequelize';

import * as utils from './utils/index.js';
import { appConfig } from './config/app.js';
import { loggerConfig } from './config/logger.js';
import { constantConfig } from './config/constant.js';
import { schemaConfig } from './config/schema.js';
import { apiConfig } from './config/api.js';
import { menuConfig } from './config/menu.js';
import { roleConfig } from './config/role.js';
import { databaseConfig } from './config/database.js';

import { systemConfig } from './system.js';

async function yiApi() {
    // 初始化项目结构
    fs.ensureDirSync(path.resolve(systemConfig.appDir, 'addons'));
    fs.ensureDirSync(path.resolve(systemConfig.appDir, 'apis'));
    fs.ensureDirSync(path.resolve(systemConfig.appDir, 'plugins'));
    fs.ensureDirSync(path.resolve(systemConfig.appDir, 'tables'));
    fs.ensureDirSync(path.resolve(systemConfig.appDir, 'config'));
    fs.ensureDirSync(path.resolve(systemConfig.appDir, 'utils'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'yiapi.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'api.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'app.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'constant.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'database.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'redis.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'role.js'));
    fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'schema.js'));

    const fastify = Fastify({
        logger: loggerConfig,
        pluginTimeout: 30000,
        genReqId: () => nanoid(),
        ajv: {
            customOptions: {
                allErrors: true,
                verbose: true
            }
        }
    });

    // 处理全局错误
    fastify.setErrorHandler(function (error, req, res) {
        if (error.validation) {
            localize.zh(error.validation);
            let msg = error.validation
                .map((error) => {
                    return (error.parentSchema.title + ' ' + error.message).trim();
                })
                .join(',');
            res.status(200).send({ code: 1, msg: msg, symbol: 'GLOBAL_ERROR' });
            return;
        }

        if (error.statusCode >= 500) {
            fastify.log.error(error);
            // 发送错误响应
        } else if (error.statusCode >= 400) {
            fastify.log.info(error);
        } else {
            fastify.log.warn(error);
        }

        // 发送错误响应
        res.status(200).send({ code: 1, msg: error.message, symbol: 'GLOBAL_ERROR' });
    });

    // 处理未找到路由
    fastify.setNotFoundHandler(function (req, res) {
        // 发送错误响应
        res.status(200).send({ code: 1, msg: '未知路由', data: req.url });
    });

    fastify.get('/', function (req, res) {
        res.send({ code: 0, msg: '接口程序已启动' });
    });

    fastify.register(autoLoad, {
        dir: path.join(systemConfig.yiapiDir, 'plugins', 'swagger'),
        indexPattern: /swagger\.js/
    });

    // 加载启动插件
    fastify.register(autoLoad, {
        dir: path.join(systemConfig.yiapiDir, 'bootstrap'),
        ignorePattern: /^_/
    });

    // 加载系统接口
    fastify.register(autoLoad, {
        dir: path.join(systemConfig.yiapiDir, 'apis'),
        options: Object.assign({})
    });

    // 加载用户接口
    fastify.register(autoLoad, {
        dir: path.join(systemConfig.appDir, 'apis'),
        options: Object.assign({})
    });

    // 加载用户插件
    fastify.register(autoLoad, {
        dir: path.join(systemConfig.appDir, 'plugins'),
        ignorePattern: /^_/
    });

    // 启动服务！
    fastify.listen({ port: appConfig.port }, async function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        await fastify.cacheTreeData();
        await fastify.cacheRoleData();
        fastify.log.info(`接口服务已启动： ${address}`);
        console.log(`接口服务已启动： ${address}`);
    });

    fastify.ready((err) => {
        if (err) throw err;
    });
}

export {
    //
    yiApi,
    utils,
    sequelize,
    constantConfig,
    schemaConfig,
    systemConfig,
    appConfig,
    apiConfig,
    menuConfig,
    roleConfig,
    databaseConfig
};
