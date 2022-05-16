import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
async function plugin(fastify, opts) {
    fastify.register(fastifyCors, function (instance) {
        return (req, callback) => {
            let corsConfig = {
                origin: req.headers.origin || req.headers.host || '*',
                methods: ['GET', 'OPTIONS', 'POST'],
                allowedHeaders: ['Content-Type', 'Authorization', 'authorization'],
                exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization', 'authorization'],
                preflightContinue: false,
                optionsSuccessStatus: 204,
                credentials: false
            };
            callback(null, corsConfig);
        };
    });
}
export default fp(plugin, { name: 'cors' });
