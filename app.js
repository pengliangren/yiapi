import path from 'path';
import fs from 'fs-extra';
import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import localize from 'ajv-i18n';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
// import logger from './config/logger.js';
import appConfig from './config/app.js';
import { fn_dirname } from './utils/index.js';

const fastify = Fastify({
    logger: true,
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

fastify.get('/', function (request, reply) {
    reply.send({ code: 0, msg: '接口程序已启动' });
});

// 加载启动插件
fastify.register(autoLoad, {
    dir: path.join(fn_dirname(import.meta.url), 'bootstrap'),
    options: Object.assign({}),
    ignorePattern: /^_/
});

// 加载业务插件
fastify.register(autoLoad, {
    dir: path.join(fn_dirname(import.meta.url), 'plugins'),
    options: Object.assign({}),
    ignorePattern: /^_/
});

// 加载接口
fastify.register(autoLoad, {
    dir: path.join(fn_dirname(import.meta.url), 'apis'),
    options: Object.assign({})
});

// 启动服务！
fastify.listen({ port: appConfig.port }, async function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    await fastify.cachePermissionData();
    await fastify.cacheRoleData();
    fastify.log.info(`服务器已启动： ${address}`);
});

fastify.ready((err) => {
    if (err) throw err;
});
