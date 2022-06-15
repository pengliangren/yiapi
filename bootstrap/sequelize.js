// 模块
import path from 'path';
import * as _ from 'lodash-es';
import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import fg from 'fast-glob';

// 内部
import * as utils from '../utils/index.js';
import { appConfig } from '../config/app.js';
import { databaseConfig } from '../config/database.js';

async function plugin(fastify, options) {
    const sequelize = await new Sequelize(databaseConfig.db, databaseConfig.username, databaseConfig.password, {
        host: databaseConfig.host,
        dialect: databaseConfig.dialect,
        port: databaseConfig.port,
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
        let { tableDescribe, tableName, tableData, tableOption } = await import(utils.relativePath(utils.dirname(import.meta.url), path.resolve('.', file)));
        let tableSchema = {};
        _.forOwn(tableData, (item, key) => {
            tableSchema[key] = item.table;
        });
        let table = await sequelize.define(tableName, tableSchema, tableOption);
        await table.sync({
            //
            // force: true,
            alter: true,
            logging: false
        });
    });

    fastify.addHook('onClose', (instance, done) => sequelize.close().then(() => done()));

    await sequelize.authenticate();
}

export default fp(plugin, { name: 'sequelize' });
