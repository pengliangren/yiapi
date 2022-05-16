import fp from 'fastify-plugin';
import fastifySensible from '@fastify/sensible';

async function sensible(fastify, opts) {
    fastify.register(fastifySensible, {
        errorHandler: false
    });
}
export default fp(sensible);
