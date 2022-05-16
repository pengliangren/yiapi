import fs from 'fs-extra';
import path from 'path';
import fp from 'fastify-plugin';
import Knex from 'knex';
import fg from 'fast-glob';
import database from '../config/database.js';

async function plugin(fastify, options) {
    try {
        // 定义数据库链接
        const mysql = await new Knex({
            client: 'mysql2',
            connection: {
                host: database.host,
                port: database.port,
                user: database.username,
                password: database.password,
                database: database.db
            },
            acquireConnectionTimeout: 30000,
            asyncStackTraces: true,
            debug: false
        });

        fastify.decorate('mysql', mysql);

        console.log('mysql已连接！');
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'mysql', dependencies: ['sequelize'] });
