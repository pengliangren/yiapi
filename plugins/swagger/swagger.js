import fp from 'fastify-plugin';
import path from 'path';
import fastifySwagger from '@fastify/swagger';
import fg from 'fast-glob';
import { appConfig } from '../../config/app.js';

async function main(fastify, opts) {
    let tags = fg.sync('./apis/*', { onlyDirectories: true, onlyFiles: false, dot: false, deep: 1 }).map((file) => {
        return { name: path.basename(file) };
    });
    fastify.register(fastifySwagger, {
        openapi: {
            info: {
                title: `${appConfig.appName}接口文档`,
                description: `${appConfig.appName}接口文档`,
                version: '1.0.0'
            },
            servers: [
                {
                    url: appConfig.apiPrefix,
                    description: '接口请求域名'
                }
            ]
        },
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false
        },
        staticCSP: true,
        exposeRoute: true,
        persistAuthorization: true
    });
}
export default fp(main, { name: 'swagger' });
