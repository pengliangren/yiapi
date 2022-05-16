import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import redis from '../config/redis.js';

async function main(fastify, opts) {
    fastify.register(fastifyRedis, redis);
    console.log('redis已连接！');
}
export default fp(main, { name: 'redis' });
