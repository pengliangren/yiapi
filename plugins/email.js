import fp from 'fastify-plugin';
import appConfig from '../config/app.js';
async function main(fastify, opts) {
    console.log('邮件发送已初始化');
}
export default fp(main, { name: 'email' });
