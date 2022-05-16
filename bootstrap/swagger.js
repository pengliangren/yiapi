import fp from 'fastify-plugin';
import path from 'path';
import fastifySwagger from '@fastify/swagger';
import redis from '../config/redis.js';
import fg from 'fast-glob';

async function main(fastify, opts) {
    let tags = fg.sync('./apis/*', { onlyDirectories: true, onlyFiles: false, dot: false, deep: 1 }).map((file) => {
        return { name: path.basename(file) };
    });
    fastify.register(fastifySwagger, {
        openapi: {
            info: {
                title: '前端世界API接口文档',
                description: '前端世界的API接口文档',
                version: '1.0.0'
            },
            servers: [
                {
                    url: 'http://localhost'
                }
            ],
            components: {
                securitySchemes: {
                    apiKey: {
                        type: 'apiKey',
                        name: 'apiKey',
                        in: 'header'
                    }
                }
            },
            // security: [Object],
            tags: tags
        },
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        staticCSP: true,
        exposeRoute: true
    });
}
export default fp(main, { name: 'swagger' });
