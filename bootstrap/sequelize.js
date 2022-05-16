// 模块
import { basename as path_basename, resolve as path_resolve } from 'path';
import { snakeCase as _snakeCase } from 'lodash-es';
import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import fg from 'fast-glob';

// 内部
import { fn_filename, fn_dirname, fn_relativePath } from '../utils/index.js';
import { rootDir } from '../system.js';
import database from '../config/database.js';

async function plugin(fastify, options) {
    const sequelize = await new Sequelize(database.db, database.username, database.password, {
        host: database.host,
        dialect: database.dialect,
        port: database.port,
        define: {
            underscored: true,
            freezeTableName: true,
            charset: 'utf8mb4',
            dialectOptions: {
                collate: 'utf8mb4_general_ci'
            },
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        },
        omitNull: false
    });

    fg.sync('./tables/**/*', { onlyFiles: true, dot: false }).forEach(async (file) => {
        let tableName = _snakeCase(path_basename(file, '.js'));
        let { default: tableFields } = await import(fn_relativePath(fn_dirname(import.meta.url), path_resolve(rootDir, file)));
        let table = await sequelize.define(tableName, tableFields);
        await table.sync({
            //
            // force: true,
            alter: true,
            logging: false
        });
    });

    fastify.addHook('onClose', (instance, done) => sequelize.close().then(() => done()));

    await sequelize.authenticate();
    console.log('表结构已同步完毕！');
}

export default fp(plugin, { name: 'sequelize' });
